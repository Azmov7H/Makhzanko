import { Card, CardTitle } from "@/components/ui/card"
import { ChartNetwork, Globe, ShoppingBag } from "lucide-react"

type Props = {}

export default function Feutcher({}: Props) {
    const content = [
        {id: 1, title: 'سهولة الاستخدام', description: 'واجهة مستخدم بسيطة وسهلة الاستخدام لتسهيل إدارة المخزون.' , icon:<ShoppingBag />},
        {id: 2, title: 'تقارير مفصلة', description: 'احصل على تقارير شاملة حول المخزون والمبيعات.', icon:<ChartNetwork />},
        {id: 3, title: 'تنبيهات المخزون', description: 'تلقي تنبيهات عند انخفاض مستويات المخزون.', icon:<Globe />},
    ]
  return (
    <div className="grid gap-8 md:grid-cols-3">

        {content.map((item) => (
            <Card key={item.id} className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
                <CardTitle className="flex items-center gap-3 mb-4 text-primary">
                    <div className="size-6 text-primary">
                        {item.icon}
                    </div>
                    </CardTitle>
                <h3 className="mb-4 text-lg font-semibold">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
            </Card>
        ))}
    </div>
  )
};