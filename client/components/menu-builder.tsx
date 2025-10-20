"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Plus, Pencil, Trash2 } from "lucide-react"
import useSWR from "swr"
import type { Category, MenuItem } from "@/lib/types"
import { fetchAdminAPI } from "@/lib/api"

interface MenuBuilderProps {
  adminToken: string
  initialMenu: { categories: Category[]; items: MenuItem[] }
}

export function MenuBuilder({ adminToken, initialMenu }: MenuBuilderProps) {
  const { data: menu, mutate } = useSWR(`/admin/menu`, () => fetchAdminAPI("/admin/menu", adminToken), {
    fallbackData: initialMenu,
  })

  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [itemDialogOpen, setItemDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)

  const [categoryForm, setCategoryForm] = useState({ name: "" })
  const [itemForm, setItemForm] = useState({
    categoryId: "",
    name: "",
    description: "",
    price: "",
    image: "",
    available: true,
  })

  const handleSaveCategory = async () => {
    try {
      if (editingCategory) {
        await fetchAdminAPI(`/admin/menu/categories/${editingCategory.id}`, adminToken, {
          method: "PUT",
          body: JSON.stringify(categoryForm),
        })
      } else {
        await fetchAdminAPI("/admin/menu/categories", adminToken, {
          method: "POST",
          body: JSON.stringify(categoryForm),
        })
      }
      mutate()
      setCategoryDialogOpen(false)
      setCategoryForm({ name: "" })
      setEditingCategory(null)
    } catch (error) {
      console.error("Failed to save category:", error)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Delete this category?")) return
    try {
      await fetchAdminAPI(`/admin/menu/categories/${id}`, adminToken, { method: "DELETE" })
      mutate()
    } catch (error) {
      console.error("Failed to delete category:", error)
    }
  }

  const handleSaveItem = async () => {
    try {
      const payload = {
        ...itemForm,
        price: Number.parseFloat(itemForm.price),
      }

      if (editingItem) {
        await fetchAdminAPI(`/admin/menu/items/${editingItem.id}`, adminToken, {
          method: "PUT",
          body: JSON.stringify(payload),
        })
      } else {
        await fetchAdminAPI("/admin/menu/items", adminToken, {
          method: "POST",
          body: JSON.stringify(payload),
        })
      }
      mutate()
      setItemDialogOpen(false)
      setItemForm({ categoryId: "", name: "", description: "", price: "", image: "", available: true })
      setEditingItem(null)
    } catch (error) {
      console.error("Failed to save item:", error)
    }
  }

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Delete this item?")) return
    try {
      await fetchAdminAPI(`/admin/menu/items/${id}`, adminToken, { method: "DELETE" })
      mutate()
    } catch (error) {
      console.error("Failed to delete item:", error)
    }
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Menu Builder</h1>
          <p className="text-muted-foreground">Manage your menu items and categories</p>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Categories</h2>
          <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                onClick={() => {
                  setEditingCategory(null)
                  setCategoryForm({ name: "" })
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingCategory ? "Edit Category" : "Add Category"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="category-name">Name</Label>
                  <Input
                    id="category-name"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ name: e.target.value })}
                  />
                </div>
                <Button onClick={handleSaveCategory} className="w-full">
                  Save
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {menu.categories.map((category) => (
            <Card key={category.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{category.name}</span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingCategory(category)
                        setCategoryForm({ name: category.name })
                        setCategoryDialogOpen(true)
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(category.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Menu Items</h2>
          <Dialog open={itemDialogOpen} onOpenChange={setItemDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                onClick={() => {
                  setEditingItem(null)
                  setItemForm({ categoryId: "", name: "", description: "", price: "", image: "", available: true })
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingItem ? "Edit Item" : "Add Item"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="item-category">Category</Label>
                  <select
                    id="item-category"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    value={itemForm.categoryId}
                    onChange={(e) => setItemForm({ ...itemForm, categoryId: e.target.value })}
                  >
                    <option value="">Select category</option>
                    {menu.categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="item-name">Name</Label>
                  <Input
                    id="item-name"
                    value={itemForm.name}
                    onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="item-description">Description</Label>
                  <Textarea
                    id="item-description"
                    value={itemForm.description}
                    onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="item-price">Price</Label>
                  <Input
                    id="item-price"
                    type="number"
                    step="0.01"
                    value={itemForm.price}
                    onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="item-image">Image URL</Label>
                  <Input
                    id="item-image"
                    value={itemForm.image}
                    onChange={(e) => setItemForm({ ...itemForm, image: e.target.value })}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="item-available"
                    checked={itemForm.available}
                    onCheckedChange={(checked) => setItemForm({ ...itemForm, available: checked })}
                  />
                  <Label htmlFor="item-available">Available</Label>
                </div>
                <Button onClick={handleSaveItem} className="w-full">
                  Save
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {menu.items.map((item) => (
            <Card key={item.id}>
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  {item.image && (
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{item.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                        <p className="font-semibold text-primary mt-1">${item.price.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">{item.available ? "Available" : "Unavailable"}</p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setEditingItem(item)
                            setItemForm({
                              categoryId: item.categoryId,
                              name: item.name,
                              description: item.description,
                              price: item.price.toString(),
                              image: item.image || "",
                              available: item.available,
                            })
                            setItemDialogOpen(true)
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
