# نظام التصميم - مخزنكو

## نظرة عامة

تم تصميم واجهة مستخدم حديثة ومتجاوبة لمنصة SaaS متعددة المستأجرين مع دعم كامل للغة العربية و RTL.

## الألوان

### الألوان الأساسية
- **Primary**: `#2563EB` (أزرق)
- **Accent**: `#22C55E` (أخضر)
- **Background**: متغير حسب الوضع (فاتح/داكن)
- **Foreground**: متغير حسب الوضع

### الوضع الداكن
- جميع الألوان تتكيف تلقائياً مع الوضع الداكن
- انتقالات سلسة بين الأوضاع

## الخطوط

- **Cairo**: الخط الأساسي للعربية
- **IBM Plex Sans Arabic**: للعناوين والنصوص المهمة
- دعم كامل للعربية مع RTL

## المكونات

### 1. Skeleton Loading
```tsx
import { Skeleton } from "@/components/ui/skeleton";

<Skeleton className="h-4 w-[250px]" />
```

### 2. Empty States
```tsx
import { EmptyState } from "@/components/ui/empty-state";

<EmptyState
  icon={Package}
  title="لا توجد منتجات"
  description="ابدأ بإضافة منتجك الأول"
  action={{
    label: "إضافة منتج",
    onClick: () => {}
  }}
/>
```

### 3. Cards
- تصميم نظيف مع ظلال خفيفة
- انتقالات سلسة عند hover
- دعم كامل للوضع الداكن

### 4. Tables
- تصميم حديث مع hover effects
- Badges للأحوال والأدوار
- دعم RTL كامل

## Layout

### Sidebar
- قابلة للطي على الموبايل
- تصميم حديث مع أيقونات
- Theme toggle مدمج
- دعم RTL كامل

### Header
- معلومات المستأجر
- Plan badge
- User menu dropdown
- Owner panel link (للمالكين فقط)

## الصفحات

### Dashboard
- Cards للإحصائيات
- Quick links للوصول السريع
- تصميم نظيف ومرتب

### Products
- Empty state عند عدم وجود منتجات
- Statistics cards
- Table مع actions menu
- Badges للمخزون

### Owner Panel
- Dashboard مع analytics
- User management
- Tenant management
- Subscription management
- Activity logs

## RTL Support

- دعم كامل للعربية من اليمين لليسار
- جميع المكونات متوافقة مع RTL
- Layout يتكيف تلقائياً

## Dark Mode

- Theme Provider مدمج
- انتقالات سلسة
- جميع المكونات متوافقة
- حفظ التفضيلات

## Toast Notifications

- استخدام Sonner
- دعم RTL
- Rich colors
- Close button

## Transitions

- انتقالات سلسة لجميع العناصر
- Hover effects
- Theme switching animations
- Loading states

## Responsive Design

- Mobile-first approach
- Breakpoints:
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px

## Accessibility

- Contrast ratios مناسبة
- Keyboard navigation
- Screen reader support
- ARIA labels

## Best Practices

1. استخدام `getTenantContext()` بدلاً من `getAuthPayload()`
2. استخدام Server Components عند الإمكان
3. Client Components فقط عند الحاجة للتفاعل
4. استخدام shadcn/ui components
5. اتباع Tailwind CSS patterns

## الملفات المهمة

- `app/globals.css`: الألوان والخطوط
- `components/layout/Sidebar.tsx`: Sidebar component
- `components/ui/skeleton.tsx`: Skeleton loading
- `components/ui/empty-state.tsx`: Empty states
- `components/providers/theme-provider.tsx`: Theme provider
- `components/ui/toaster.tsx`: Toast notifications

## الخطوات التالية

1. إضافة المزيد من الصفحات
2. تحسين Charts والـ Analytics
3. إضافة المزيد من Empty States
4. تحسين Loading States
5. إضافة Animations إضافية

