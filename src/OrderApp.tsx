import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const LOCATIONS = ["เขาวง", "บัวขาว", "แก้งเดื่อ", "แจนแลน", "สมสะอาด", "นาคู", "กุดหว้า", "กุดค้าว", "หนองโง้ง", "หนองฟ้าเลื่อน", "บ้านค้อ", "โพนนาดี", "นาไคร้"];

const MENU_ITEMS = [
  { name: "ขนมจีนน้ำปลาร้า", key: "nam_plara", price: 50 },
  { name: "ขนมจีนน้ำกะปิ", key: "nam_kapi", price: 50 },
  { name: "ไข่ปี้ง", key: "egg", price: 30 },
  { name: "ขนมใส่ไส้", key: "kanom_sai_sai", price: 30 },
  { name: "กาละแม", key: "kalamare", price: 40, note: "3 ถุง 110 บาท" },
  { name: "ตีนไก่ต้มเปื่อย", key: "chicken_feet", price: 30 },
  { name: "ขนมตาล", key: "kanom_tan", price: 30 },
  { name: "ขนมชั้น", key: "kanom_chan", price: 25 },
  { name: "ขนมถ้วย", key: "kanom_tuay", price: 30 },
  { name: "ข้าวต้มข้าวโพด", key: "khao_tom", price: 30 },
  { name: "ขนมไส้ถั่วเหลือง", key: "kanom_thua", price: 25 }
];

export default function OrderApp() {
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ name: '', facebook: '', phone: '', location: '', paid: false, delivered: false, items: {} });
  const [editIndex, setEditIndex] = useState(null);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleItemChange = (key, quantity) => {
    setForm({ ...form, items: { ...form.items, [key]: Number(quantity) } });
  };

  const handleSubmit = () => {
    if (!form.name || !form.phone || !form.location) return;
    const updatedOrders = [...orders];
    if (editIndex !== null) {
      updatedOrders[editIndex] = form;
      setOrders(updatedOrders);
      setEditIndex(null);
    } else {
      updatedOrders.push(form);
      setOrders(updatedOrders);
    }
    setForm({ name: '', facebook: '', phone: '', location: '', paid: false, delivered: false, items: {} });
  };

  const handleEdit = (index) => {
    setForm(orders[index]);
    setEditIndex(index);
  };

  const handleDelete = (location, index) => {
    const updated = { ...groupedOrders };
    updated[location].splice(index, 1);
    setOrders(Object.values(updated).flat());
  };

  const togglePaid = (orderIndex, location) => {
    const updatedOrders = [...orders];
    const index = orders.findIndex((order, i) => order.location === location && groupedOrders[location].indexOf(order) === orderIndex);
    updatedOrders[index].paid = !updatedOrders[index].paid;
    setOrders(updatedOrders);
  };

  const toggleDelivered = (orderIndex, location) => {
    const updatedOrders = [...orders];
    const index = orders.findIndex((order, i) => order.location === location && groupedOrders[location].indexOf(order) === orderIndex);
    updatedOrders[index].delivered = !updatedOrders[index].delivered;
    setOrders(updatedOrders);
  };

  const groupedOrders = orders.reduce((acc, order) => {
    if (!acc[order.location]) acc[order.location] = [];
    acc[order.location].push(order);
    return acc;
  }, {});

  const calculateTotal = (items) => {
    return Object.entries(items).reduce((sum, [key, qty]) => {
      const item = MENU_ITEMS.find(m => m.key === key);
      if (!item) return sum;
      if (key === 'kalamare' && qty >= 3) {
        const setsOf3 = Math.floor(qty / 3);
        const remaining = qty % 3;
        return sum + setsOf3 * 110 + remaining * item.price;
      }
      return sum + item.price * qty;
    }, 0);
  };

  return (
    <div className="p-4 max-w-lg mx-auto space-y-4">
      <Card>
        <CardContent className="space-y-2 pt-4">
          <h2 className="text-xl font-bold">ฟอร์มสั่งซื้อ</h2>
          <Input placeholder="ชื่อผู้สั่ง" value={form.name} onChange={e => handleChange('name', e.target.value)} />
          <Input placeholder="ชื่อเฟสบุ๊ก" value={form.facebook} onChange={e => handleChange('facebook', e.target.value)} />
          <Input placeholder="เบอร์โทร" value={form.phone} onChange={e => handleChange('phone', e.target.value)} />
          <Select onValueChange={val => handleChange('location', val)} value={form.location}>
            <SelectTrigger><SelectValue placeholder="เลือกสถานที่จัดส่ง" /></SelectTrigger>
            <SelectContent>
              {LOCATIONS.map(loc => <SelectItem key={loc} value={loc}>{loc}</SelectItem>)}
            </SelectContent>
          </Select>
          {MENU_ITEMS.map(item => (
            <div key={item.key} className="flex items-center justify-between">
              <label>{item.name} ({item.price}฿)</label>
              <Input type="number" min="0" value={form.items[item.key] || ''} onChange={e => handleItemChange(item.key, e.target.value)} className="w-20" />
            </div>
          ))}
          <div className="flex items-center space-x-2">
            <Checkbox checked={form.paid} onCheckedChange={val => handleChange('paid', val)} />
            <label>ชำระเงินแล้ว</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox checked={form.delivered} onCheckedChange={val => handleChange('delivered', val)} />
            <label>ส่งของแล้ว</label>
          </div>
          <Button onClick={handleSubmit} className="w-full">{editIndex !== null ? 'แก้ไขออเดอร์' : 'บันทึกออเดอร์'}</Button>
        </CardContent>
      </Card>

      <Tabs defaultValue={LOCATIONS[0]}>
        <TabsList className="flex overflow-x-auto">
          {Object.keys(groupedOrders).map(loc => (
            <TabsTrigger key={loc} value={loc}>{loc}</TabsTrigger>
          ))}
        </TabsList>
        {Object.entries(groupedOrders).map(([loc, orders]) => (
          <TabsContent key={loc} value={loc} className="space-y-2">
            {orders.map((order, i) => (
              <Card key={i} className="border border-gray-200">
                <CardContent className="p-4 space-y-2">
                  <div className="font-semibold">{order.name} ({order.phone})</div>
                  <div className="text-sm text-gray-600">FB: {order.facebook}</div>
                  <ul className="text-sm list-disc ml-5">
                    {Object.entries(order.items).filter(([_, qty]) => qty > 0).map(([key, qty]) => {
                      const item = MENU_ITEMS.find(m => m.key === key);
                      return <li key={key}>{item?.name} x {qty}</li>;
                    })}
                  </ul>
                  <div className="text-sm font-medium">ยอดรวม: {calculateTotal(order.items)} บาท</div>
                  <div className="flex gap-2 text-sm">
                    <Button size="sm" variant="outline" onClick={() => togglePaid(i, loc)}>{order.paid ? '✓ ชำระแล้ว' : 'ชำระเงิน'}</Button>
                    <Button size="sm" variant="outline" onClick={() => toggleDelivered(i, loc)}>{order.delivered ? '✓ ส่งแล้ว' : 'ยังไม่ส่ง'}</Button>
                    <Button size="sm" variant="secondary" onClick={() => handleEdit(orders.findIndex(o => o === order))}>แก้ไข</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(loc, i)}>ลบ</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
