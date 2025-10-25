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
    viewBill: 'View Bill',
    yourBill: 'Your Bill',
    yourOrder: 'Your Order',
    items: 'items',
    item: 'item',
    subtotal: 'Subtotal',
    removeItem: 'Remove item',
    quantity: 'Quantity',
    qty: 'Qty',
    noItemsYet: 'No items added yet',
    goToPayment: 'Go to Payment',
    
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
    myItemsOnly: 'My Items Only',
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
    viewBill: 'Посмотреть счет',
    yourBill: 'Ваш счет',
    yourOrder: 'Ваш заказ',
    items: 'позиций',
    item: 'позиция',
    subtotal: 'Подытог',
    removeItem: 'Удалить позицию',
    quantity: 'Количество',
    qty: 'Кол-во',
    noItemsYet: 'Позиции еще не добавлены',
    goToPayment: 'Перейти к оплате',
    
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
    myItemsOnly: 'Только мои позиции',
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
    viewBill: 'Դիտել հաշիվը',
    yourBill: 'Ձեր հաշիվը',
    yourOrder: 'Ձեր պատվերը',
    items: 'ապրանքներ',
    item: 'ապրանք',
    subtotal: 'Միջանկյալ գումար',
    removeItem: 'Հեռացնել ապրանքը',
    quantity: 'Քանակ',
    qty: 'Քնկ',
    noItemsYet: 'Ապրանքներ դեռ չեն ավելացվել',
    goToPayment: 'Անցնել վճարման',
    
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
    myItemsOnly: 'Միայն իմ ապրանքները',
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
  },
}

export type TranslationKey = keyof typeof translations.en

export function getTranslation(lang: Language, key: TranslationKey): string {
  return translations[lang][key] || translations.en[key] || key
}
