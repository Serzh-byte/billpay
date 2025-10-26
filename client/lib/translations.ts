export type Language = 'en' | 'ru' | 'hy'

export const languages = {
  en: 'English',
  ru: 'Русский',
  hy: 'Հայերեն',
}

export const translations = {
  en: {
    // Landing Page
    welcomeToTable: 'Welcome to your table',
    viewMenu: 'View Menu',
    payBill: 'Pay Bill',
    invalidTable: 'Invalid Table',
    invalidTableDesc: 'This table could not be found. Please scan the QR code at your table or check the URL.',
    tokenUsed: 'Token used',
    forTesting: 'For testing, use',
    
    // Menu Page
    menu: 'Menu',
    all: 'All',
    addToOrder: 'Add to Order',
    addToBill: 'Add to Bill',
    adding: 'Adding...',
    viewBill: 'View Cart',
    yourBill: 'Your Cart',
    yourOrder: 'Your Order',
    items: 'items',
    item: 'item',
    subtotal: 'Subtotal',
    removeItem: 'Remove item',
    quantity: 'Quantity',
    qty: 'Qty',
    noItemsYet: 'No items added yet',
    goToPayment: 'Order',
    
    // Payment Page
    payment: 'Payment',
    billSummary: 'Bill Summary',
    billBreakdown: 'Bill Breakdown',
    tax: 'Tax',
    serviceFee: 'Service Fee',
    tip: 'Tip',
    addTip: 'Add Tip',
    total: 'Total',
    customTip: 'Custom',
    customAmount: 'Custom Amount',
    tipAmount: 'Tip Amount',
    payNow: 'Pay Now',
    confirmPayment: 'Confirm Payment',
    processingPayment: 'Processing...',
    paymentMode: 'Payment Mode',
    payFullBill: 'Pay Full Bill',
    splitEvenly: 'Split Evenly',
    myItemsOnly: 'Pay for My Items Only',
    included: 'Included',
    noBillFound: 'No bill found',
    
    // Receipt Page
    receipt: 'Receipt',
    thankYou: 'Thank you for your visit!',
    paymentSuccessful: 'Payment Successful',
    orderDetails: 'Order Details',
    backToHome: 'Back to Home',
    paidOn: 'Paid on',
    
    // Common
    loading: 'Loading',
    error: 'Error',
    close: 'Close',
    confirm: 'Confirm',
    cancel: 'Cancel',
    back: 'Back',
    
    // Admin
    admin: 'Admin',
    dashboard: 'Dashboard',
    orders: 'Orders',
    activeOrders: 'Active Orders',
    openTable: 'open table',
    openTables: 'open tables',
    refresh: 'Refresh',
    customer: 'customer',
    customers: 'customers',
    orderItems: 'Order Items',
    startedAt: 'Started',
    byCustomer: 'By Customer',
    noActiveOrders: 'No active orders',
    
    // Category labels
    category_appetizers: 'Appetizers',
    category_main_courses: 'Main Courses',
    category_desserts: 'Desserts',
    category_beverages: 'Beverages',
  },
  ru: {
    // Landing Page
    welcomeToTable: 'Добро пожаловать за ваш столик',
    viewMenu: 'Посмотреть меню',
    payBill: 'Оплатить счет',
    invalidTable: 'Недействительный столик',
    invalidTableDesc: 'Этот столик не найден. Пожалуйста, отсканируйте QR-код на вашем столике или проверьте URL.',
    tokenUsed: 'Использованный токен',
    forTesting: 'Для тестирования используйте',
    
    // Menu Page
    menu: 'Меню',
    all: 'Все',
    addToOrder: 'Добавить в заказ',
    addToBill: 'Добавить в счет',
    adding: 'Добавление...',
    viewBill: 'Посмотреть корзину',
    yourBill: 'Ваша корзина',
    yourOrder: 'Ваш заказ',
    items: 'позиций',
    item: 'позиция',
    subtotal: 'Подытог',
    removeItem: 'Удалить позицию',
    quantity: 'Количество',
    qty: 'Кол-во',
    noItemsYet: 'Позиции еще не добавлены',
    goToPayment: 'Заказать',
    
    // Payment Page
    payment: 'Оплата',
    billSummary: 'Итоговый счет',
    billBreakdown: 'Детализация счета',
    tax: 'Налог',
    serviceFee: 'Сервисный сбор',
    tip: 'Чаевые',
    addTip: 'Добавить чаевые',
    total: 'Итого',
    customTip: 'Свои',
    customAmount: 'Своя сумма',
    tipAmount: 'Сумма чаевых',
    payNow: 'Оплатить',
    confirmPayment: 'Подтвердить оплату',
    processingPayment: 'Обработка...',
    paymentMode: 'Способ оплаты',
    payFullBill: 'Оплатить полный счет',
    splitEvenly: 'Разделить поровну',
    myItemsOnly: 'Оплатить только мои позиции',
    included: 'Включено',
    noBillFound: 'Счет не найден',
    
    // Receipt Page
    receipt: 'Чек',
    thankYou: 'Спасибо за ваш визит!',
    paymentSuccessful: 'Оплата успешна',
    orderDetails: 'Детали заказа',
    backToHome: 'Вернуться на главную',
    paidOn: 'Оплачено',
    
    // Common
    loading: 'Загрузка',
    error: 'Ошибка',
    close: 'Закрыть',
    confirm: 'Подтвердить',
    cancel: 'Отмена',
    back: 'Назад',
    
    // Admin
    admin: 'Админ',
    dashboard: 'Панель',
    orders: 'Заказы',
    activeOrders: 'Активные заказы',
    openTable: 'открытый столик',
    openTables: 'открытых столиков',
    refresh: 'Обновить',
    customer: 'клиент',
    customers: 'клиентов',
    orderItems: 'Заказанные блюда',
    startedAt: 'Начато',
    byCustomer: 'По клиентам',
    noActiveOrders: 'Нет активных заказов',
    
    // Category labels
    category_appetizers: 'Закуски',
    category_main_courses: 'Основные блюда',
    category_desserts: 'Десерты',
    category_beverages: 'Напитки',
  },
  hy: {
    // Landing Page
    welcomeToTable: 'Բարի գալուստ ձեր սեղան',
    viewMenu: 'Դիտել ճաշացանկը',
    payBill: 'Վճարել հաշիվը',
    invalidTable: 'Անվավեր սեղան',
    invalidTableDesc: 'Այս սեղանը չի գտնվել: Խնդրում ենք սկանավորել QR կոդը ձեր սեղանին կամ ստուգել URL-ը:',
    tokenUsed: 'Օգտագործված թոքեն',
    forTesting: 'Փորձարկման համար օգտագործեք',
    
    // Menu Page
    menu: 'Ճաշացանկ',
    all: 'Բոլորը',
    addToOrder: 'Ավելացնել պատվերին',
    addToBill: 'Ավելացնել հաշիվը',
    adding: 'Ավելացվում է...',
    viewBill: 'Դիտել զամբյուղը',
    yourBill: 'Ձեր զամբյուղը',
    yourOrder: 'Ձեր պատվերը',
    items: 'ապրանքներ',
    item: 'ապրանք',
    subtotal: 'Միջանկյալ գումար',
    removeItem: 'Հեռացնել ապրանքը',
    quantity: 'Քանակ',
    qty: 'Քնկ',
    noItemsYet: 'Ապրանքներ դեռ չեն ավելացվել',
    goToPayment: 'Պատվիրել',
    
    // Payment Page
    payment: 'Վճարում',
    billSummary: 'Հաշվի ամփոփում',
    billBreakdown: 'Հաշվի մանրամասներ',
    tax: 'Հարկ',
    serviceFee: 'Սպասարկման վճար',
    tip: 'Թիփ',
    addTip: 'Ավելացնել թիփ',
    total: 'Ընդամենը',
    customTip: 'Սեփական',
    customAmount: 'Սեփական գումար',
    tipAmount: 'Թիփի գումար',
    payNow: 'Վճարել հիմա',
    confirmPayment: 'Հաստատել վճարումը',
    processingPayment: 'Մշակվում է...',
    paymentMode: 'Վճարման եղանակ',
    payFullBill: 'Վճարել ամբողջ հաշիվը',
    splitEvenly: 'Բաժանել հավասարապես',
    myItemsOnly: 'Վճարել միայն իմ ապրանքները',
    included: 'Ներառված է',
    noBillFound: 'Հաշիվ չի գտնվել',
    
    // Receipt Page
    receipt: 'Անդորրագիր',
    thankYou: 'Շնորհակալություն ձեր այցելության համար!',
    paymentSuccessful: 'Վճարումը հաջող էր',
    orderDetails: 'Պատվերի մանրամասներ',
    backToHome: 'Վերադառնալ գլխավոր էջ',
    paidOn: 'Վճարված է',
    
    // Common
    loading: 'Բեռնվում է',
    error: 'Սխալ',
    close: 'Փակել',
    confirm: 'Հաստատել',
    cancel: 'Չեղարկել',
    back: 'Հետ',
    
    // Admin
    admin: 'Ադմին',
    dashboard: 'Վահանակ',
    orders: 'Պատվերներ',
    activeOrders: 'Ակտիվ պատվերներ',
    openTable: 'բաց սեղան',
    openTables: 'բաց սեղաններ',
    refresh: 'Թարմացնել',
    customer: 'հաճախորդ',
    customers: 'հաճախորդներ',
    orderItems: 'Պատվիրված ուտեստներ',
    startedAt: 'Սկսվել է',
    byCustomer: 'Ըստ հաճախորդի',
    noActiveOrders: 'Ակտիվ պատվերներ չկան',
    
    // Category labels
    category_appetizers: 'Նախորվածներ',
    category_main_courses: 'Հիմնական ուտեստներ',
    category_desserts: 'Դեսերտներ',
    category_beverages: 'Խմիչքներ',
  },
}

// Menu items translation map. Keyed by original item name -> translations.
export const menuItemTranslations: Record<string, Partial<Record<Language, string>>> = {
  // Appetizers
  'Spring Rolls': { ru: 'Спринг-роллы', hy: 'Սպրինգ ռոլներ' },
  'Chicken Wings': { ru: 'Куриные крылышки', hy: 'Հավի թևեր' },
  'Calamari': { ru: 'Кальмары', hy: 'Կաղամար' },
  
  // Main Courses
  'Grilled Salmon': { ru: 'Лосось на гриле', hy: 'Խորովածի սաղմոն' },
  'Ribeye Steak': { ru: 'Стейк Рибай', hy: 'Ռիբայ սթեյք' },
  'Chicken Parmesan': { ru: 'Курица Пармезан', hy: 'Հավ Պարմեզան' },
  'Vegetarian Pasta': { ru: 'Вегетарианская паста', hy: 'Բանջարեղենային մակարոն' },
  
  // Desserts
  'Chocolate Lava Cake': { ru: 'Шоколадный лавовый торт', hy: 'Շոկոլադե լավա տորթ' },
  'Tiramisu': { ru: 'Тирамису', hy: 'Տիրամիսու' },
  'Cheesecake': { ru: 'Чизкейк', hy: 'Չիզքեյք' },
  
  // Beverages
  'Soft Drinks': { ru: 'Безалкогольные напитки', hy: 'Զովացուցիչ ըմպելիքներ' },
  'Fresh Juice': { ru: 'Свежевыжатый сок', hy: 'Թարմ հյութ' },
  'Coffee': { ru: 'Кофе', hy: 'Սուրճ' },
}

// Menu item descriptions translation map.
export const menuItemDescriptions: Record<string, Partial<Record<Language, string>>> = {
  // Appetizers
  'Crispy vegetable spring rolls with sweet chili sauce': { 
    ru: 'Хрустящие овощные спринг-роллы со сладким чили соусом', 
    hy: 'Քրթած բանջարեղենային սպրինգ ռոլներ քաղցր չիլի սոուսով' 
  },
  'Buffalo wings with ranch dressing': { 
    ru: 'Крылышки Буффало с ранч-соусом', 
    hy: 'Բուֆֆալո թևեր ռանչ սոուսով' 
  },
  'Fried calamari rings with marinara sauce': { 
    ru: 'Жареные кольца кальмара с соусом маринара', 
    hy: 'Տապակած կաղամարի օղակներ մարինարա սոուսով' 
  },
  
  // Main Courses
  'Fresh Atlantic salmon with roasted vegetables': { 
    ru: 'Свежий атлантический лосось с жареными овощами', 
    hy: 'Թարմ ատլանտյան սաղմոն խորովածի բանջարեղեններով' 
  },
  '12oz ribeye with garlic mashed potatoes': { 
    ru: 'Рибай 12 унций с картофельным пюре с чесноком', 
    hy: '12 ունց ռիբայ սխտորի պյուրեով սխտորով' 
  },
  'Breaded chicken breast with marinara and mozzarella': { 
    ru: 'Куриная грудка в панировке с соусом маринара и моцареллой', 
    hy: 'Պանարված հավի կուրծք մարինարա սոուսով և մոցարելլայով' 
  },
  'Penne pasta with seasonal vegetables in tomato sauce': { 
    ru: 'Паста пенне с сезонными овощами в томатном соусе', 
    hy: 'Պեննե մակարոն սեզոնային բանջարեղեններով լոլիկի սոուսում' 
  },
  
  // Desserts
  'Warm chocolate cake with vanilla ice cream': { 
    ru: 'Теплый шоколадный торт с ванильным мороженым', 
    hy: 'Տաք շոկոլադե տորթ վանիլային պաղպաղակով' 
  },
  'Classic Italian dessert with coffee and mascarpone': { 
    ru: 'Классический итальянский десерт с кофе и маскарпоне', 
    hy: 'Դասական իտալական դեսերտ սուրճով և մասկարպոնեով' 
  },
  'New York style cheesecake with berry compote': { 
    ru: 'Чизкейк в нью-йоркском стиле с ягодным компотом', 
    hy: 'Նյու Յորքյան ոճի չիզքեյք հատապտղի կոմպոտով' 
  },
  
  // Beverages
  'Coca-Cola, Sprite, Fanta, Iced Tea': { 
    ru: 'Кока-Кола, Спрайт, Фанта, Холодный чай', 
    hy: 'Կոկա-Կոլա, Սփրայթ, Ֆանտա, Սառը թեյ' 
  },
  'Orange, Apple, or Cranberry juice': { 
    ru: 'Апельсиновый, яблочный или клюквенный сок', 
    hy: 'Նարնջի, խնձորի կամ զիբախտի հյութ' 
  },
  'Freshly brewed coffee': { 
    ru: 'Свежесваренный кофе', 
    hy: 'Թարմ եփած սուրճ' 
  },
}

// Try to translate a category name. If it looks like one of the known English labels
// map it to the translation keys above; otherwise return the original.
export function translateCategoryName(lang: Language, categoryName: string): string {
  if (!categoryName) return categoryName
  const n = categoryName.toLowerCase()
  if (n.includes('appetiz') || n.includes('starter') || n.includes('starter')) {
    return translations[lang].category_appetizers || translations.en.category_appetizers
  }
  if (n.includes('main') || n.includes('course') || n.includes('entrée') || n.includes('entree')) {
    return translations[lang].category_main_courses || translations.en.category_main_courses
  }
  if (n.includes('dessert') || n.includes('sweet')) {
    return translations[lang].category_desserts || translations.en.category_desserts
  }
  if (n.includes('beverage') || n.includes('drink') || n.includes('coffee') || n.includes('tea')) {
    return translations[lang].category_beverages || translations.en.category_beverages
  }
  // Fallback: return the original categoryName
  return categoryName
}

// Translate a menu item name using the translation map when available.
export function translateMenuItemName(lang: Language, name: string): string {
  if (!name) return name
  const mapped = menuItemTranslations[name]
  if (mapped && mapped[lang]) return mapped[lang] as string
  // fallback to English name if language missing
  return name
}

// Translate a menu item description using the translation map when available.
export function translateMenuItemDescription(lang: Language, description: string): string {
  if (!description) return description
  const mapped = menuItemDescriptions[description]
  if (mapped && mapped[lang]) return mapped[lang] as string
  // fallback to original description if language missing
  return description
}

export type TranslationKey = keyof typeof translations.en

export function getTranslation(lang: Language, key: TranslationKey): string {
  return translations[lang][key] || translations.en[key] || key
}
