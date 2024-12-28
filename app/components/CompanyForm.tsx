"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"

const formSchema = z.object({
  companyName: z.string().min(1, "公司姓名为必填项"),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "请输入有效的电话号码"),
  phoneExt: z.string().regex(/^\d+$/, "分机号必须是数字"),
  companyAddress: z.string().min(1, "公司地址为必填项"),
  shippingAddress: z.string().optional(),
  productType: z.enum(["客梯", "自动扶梯", "自动人行道"]),
  weight: z.enum(["630", "1000", "1250", "custom"]),
  customWeight: z.number().min(200).max(10000).optional(),
  width: z.string(),
  depth: z.string(),
})

export function CompanyForm() {
  const [selectedWeight, setSelectedWeight] = useState("630")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productType: "客梯",
      weight: "630",
      width: "1100",
      depth: "1400",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    alert("表单提交成功！")
  }

  const handleWeightChange = (value: string) => {
    setSelectedWeight(value)
    let width = "1100"
    let depth = "1400"

    if (value === "630") {
      width = "1100"
      depth = "1400"
    } else if (value === "1000") {
      width = "1200"
      depth = "2100"
    } else if (value === "1250") {
      width = "1200"
      depth = "2100"
    }

    form.setValue("width", width)
    form.setValue("depth", depth)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>公司名称</FormLabel>
              <FormControl>
                <Input placeholder="请输入公司名称" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>电话号码</FormLabel>
              <FormControl>
                <Input placeholder="请输入电话号码" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneExt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>分机号</FormLabel>
              <FormControl>
                <Input placeholder="请输入分机号" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="companyAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>公司地址</FormLabel>
              <FormControl>
                <Input placeholder="请输入公司地址" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="shippingAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>账单地址</FormLabel>
              <FormControl>
                <Input placeholder="如与公司地址相同则无需填写" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="productType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>产品类型</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="选择产品类型" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="客梯">客梯</SelectItem>
                  <SelectItem value="自动扶梯">自动扶梯</SelectItem>
                  <SelectItem value="自动人行道">自动人行道</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>载重（千克）</FormLabel>
              <Select onValueChange={(value) => {
                field.onChange(value)
                handleWeightChange(value)
              }} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="选择载重" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="630">630</SelectItem>
                  <SelectItem value="1000">1000</SelectItem>
                  <SelectItem value="1250">1250</SelectItem>
                  <SelectItem value="custom">自定义</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedWeight === "custom" && (
          <FormField
            control={form.control}
            name="customWeight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>自定义载重（千克）</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="输入载重(200-10000)" 
                    {...field}
                    onChange={e => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  载重范围：200至10000千克
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="width"
          render={({ field }) => (
            <FormItem>
              <FormLabel>轿厢宽度（毫米）</FormLabel>
              <FormControl>
                <Input {...field} readOnly />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="depth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>轿厢深度（毫米）</FormLabel>
              <FormControl>
                <Input {...field} readOnly />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">提交</Button>
      </form>
    </Form>
  )
} 