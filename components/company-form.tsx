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
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const formSchema = z.object({
  companyName: z.string().min(1, "公司名称不能为空"),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "请输入有效的国际电话号码"),
  phoneExt: z.string().regex(/^\d*$/, "分机号必须是数字").optional(),
  companyAddress: z.string().min(1, "公司地址不能为空"),
  serviceAddress: z.string().optional(),
  productType: z.enum(["客梯", "自动扶梯", "自动人行道"]),
  weight: z.string(),
  earlyPayment: z.string().regex(/^\d+$/, "金额必须是数字"),
  latePayment: z.string().regex(/^\d+$/, "金额必须是数字"),
})

export function CompanyForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      phoneNumber: "",
      phoneExt: "",
      companyAddress: "",
      serviceAddress: "",
      productType: "客梯",
      weight: "630",
      earlyPayment: "",
      latePayment: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  const productType = form.watch("productType")
  const weightOptions = productType === "客梯" 
    ? ["630", "1000", "1250"]
    : ["1000", "2000"]

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

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>电话号码</FormLabel>
                <FormControl>
                  <Input placeholder="+86" {...field} />
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
                  <Input placeholder="可选" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
          name="serviceAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>服务地址</FormLabel>
              <FormControl>
                <Input placeholder="如与公司地址相同则留空" {...field} />
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="选择载重" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {weightOptions.map((weight) => (
                    <SelectItem key={weight} value={weight}>
                      {weight}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="earlyPayment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>初期款认选项</FormLabel>
                <FormControl>
                  <Input type="number" min="0" placeholder="请输入金额" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="latePayment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>新期款认选项</FormLabel>
                <FormControl>
                  <Input type="number" min="0" placeholder="请输入金额" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit">提交</Button>
      </form>
    </Form>
  )
} 