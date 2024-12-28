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
import { useState, useEffect } from "react"

const formSchema = z.object({
  companyName: z.string().min(1, "公司姓名为必填项"),
  companyAddress: z.string().min(1, "公司地址为必填项"),
  areaCode: z.string()
    .min(1, "电话区号为必填项")
    .regex(/^\+\d+$/, "请输入有效的国际电话区号（以+开头）"),
  phoneNumber: z.string()
    .min(1, "电话号码为必填项")
    .regex(/^\d+$/, "电话号码必须是纯数字"),
  sameAsCompanyAddress: z.boolean().default(true),
  shippingAddress: z.string().optional(),
  productType: z.enum(["客梯", "自动扶梯", "自动人行道"]),
  weight: z.enum(["630", "1000", "1250", "custom"]).optional(),
  customWeight: z.number().min(200).max(10000).optional(),
  width: z.string().optional(),
  depth: z.string().optional(),
}).refine(
  (data) => !(data.sameAsCompanyAddress === false && !data.shippingAddress),
  {
    message: "请填写账单地址",
    path: ["shippingAddress"],
  }
)

export function CompanyForm() {
  const [selectedWeight, setSelectedWeight] = useState("630")
  const [isElevator, setIsElevator] = useState(true)
  const [showWidthSelect, setShowWidthSelect] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productType: "客梯",
      weight: "630",
      width: "1100",
      depth: "1400",
      sameAsCompanyAddress: true,
    },
  })

  const productType = form.watch("productType")

  useEffect(() => {
    const isElevatorType = productType === "客梯"
    setIsElevator(isElevatorType)
    setShowWidthSelect(false)
    
    if (!isElevatorType) {
      form.setValue("weight", undefined)
      form.setValue("customWeight", undefined)
      form.setValue("width", undefined)
      form.setValue("depth", undefined)
      setSelectedWeight("")
    } else {
      form.setValue("weight", "630")
      form.setValue("width", "1100")
      form.setValue("depth", "1400")
      setSelectedWeight("630")
    }
  }, [productType, form])

  function onSubmit(values: z.infer<typeof formSchema>) {
    const formattedValues = {
      公司名称: values.companyName,
      公司地址: values.companyAddress,
      电话区号: values.areaCode,
      电话号码: values.phoneNumber,
      账单地址: values.shippingAddress || '同公司地址',
      产品类型: values.productType,
      ...(values.productType === '客梯' ? {
        载重: values.weight === 'custom' 
          ? `${values.customWeight}千克（自定义）` 
          : `${values.weight}千克`,
        轿厢宽度: `${values.width}毫米`,
        轿厢深度: `${values.depth}毫米`
      } : {})
    }

    const message = Object.entries(formattedValues)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n')

    alert('表单提交成功！\n\n' + message)
  }

  const handleWeightChange = (value: string) => {
    setSelectedWeight(value)
    let width = "1100"
    let depth = "1400"

    if (value === "630") {
      width = "1100"
      depth = "1400"
      setShowWidthSelect(false)
    } else if (value === "1000") {
      width = "1200"
      depth = "2100"
      setShowWidthSelect(false)
    } else if (value === "1250") {
      setShowWidthSelect(true)
      width = "1200"
      depth = "2100"
    } else {
      setShowWidthSelect(false)
    }

    form.setValue("width", width)
    form.setValue("depth", depth)
  }

  const handleWidthChange = (value: string) => {
    form.setValue("width", value)
    if (value === "1200") {
      form.setValue("depth", "2100")
    } else {
      form.setValue("depth", "1400")
    }
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

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="sameAsCompanyAddress"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="h-4 w-4 mt-1"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>账单地址与公司地址相同</FormLabel>
                </div>
              </FormItem>
            )}
          />

          {!form.watch("sameAsCompanyAddress") && (
            <FormField
              control={form.control}
              name="shippingAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>账单地址</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入账单地址" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <FormField
          control={form.control}
          name="areaCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>电话区号</FormLabel>
              <FormControl>
                <Input placeholder="请输入电话区号（如：+86）" {...field} />
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

        {isElevator && (
          <>
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
                      载重范围：200-10000千克
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {showWidthSelect ? (
              <FormField
                control={form.control}
                name="width"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>轿厢宽度（毫米）</FormLabel>
                    <Select onValueChange={handleWidthChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="选择轿厢宽度" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1200">1200</SelectItem>
                        <SelectItem value="1600">1600</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
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
            )}

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
          </>
        )}

        <Button type="submit">提交</Button>
      </form>
    </Form>
  )
} 