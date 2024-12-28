"use client"

import * as React from "react"
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
  weight: z.string()
    .refine((val) => {
      if (val === "custom") return true;
      const num = Number(val);
      return !isNaN(num) && num >= 200 && num <= 10000;
    }, "载重必须在200至10000之间"),
  customWeight: z.string()
    .regex(/^\d+$/, "载重必须是数字")
    .refine((val) => {
      const num = Number(val);
      return !isNaN(num) && num >= 200 && num <= 10000;
    }, "载重必须在200至10000之间")
    .optional(),
  earlyPayment: z.string()
    .regex(/^\d+$/, "轿厢宽度必须是数字")
    .refine((val) => {
      const num = Number(val);
      return !isNaN(num) && num >= 1000 && num <= 2000;
    }, "轿厢宽度必须在1000至2000之间"),
  latePayment: z.string()
    .regex(/^\d+$/, "轿厢深度必须是数字")
    .refine((val) => {
      const num = Number(val);
      return !isNaN(num) && num >= 1000 && num <= 2500;
    }, "轿厢深度必须在1000至2500之间")
    .optional(),
})

type PaymentOptions = {
  early: string | string[];
  late: string | string[];
}

export function CompanyForm() {
  const [isCustomWeight, setIsCustomWeight] = React.useState(false);

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
      customWeight: "",
      earlyPayment: "",
      latePayment: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const finalValues = {
      ...values,
      weight: values.weight === "custom" ? values.customWeight : values.weight,
    };
    console.log(finalValues);
  }

  const productType = form.watch("productType")
  const weight = form.watch("weight")

  // 根据产品类型和载重确定可选的款项
  const getPaymentOptions = (): PaymentOptions => {
    if (productType === "客梯") {
      switch (weight) {
        case "630":
          return { early: "1100", late: "1400" }
        case "1000":
          return { early: "1200", late: "2100" }
        case "1250":
          return {
            early: ["1200", "1600"],
            late: ["2100", "1400"]
          }
        default:
          return { early: "", late: "" }
      }
    }
    return { early: "", late: "" }
  }

  // 获取载重选项
  const getWeightOptions = () => {
    return ["630", "1000", "1250", "custom"]
  }

  const weightOptions = getWeightOptions()
  const paymentOptions = getPaymentOptions()

  // 当产品类型改变时，重置载重和款项
  React.useEffect(() => {
    if (productType === "客梯") {
      form.setValue("weight", "630")
      setIsCustomWeight(false)
    } else {
      form.setValue("weight", "")
      form.setValue("customWeight", "")
      form.setValue("earlyPayment", "")
      form.setValue("latePayment", "")
    }
  }, [productType, form])

  // 当载重改变时，更新款项
  React.useEffect(() => {
    if (productType === "客梯") {
      setIsCustomWeight(weight === "custom")
      const options = getPaymentOptions()
      if (typeof options.early === "string" && options.early) {
        form.setValue("earlyPayment", options.early)
        form.setValue("latePayment", options.late as string)
      }
    }
  }, [weight, productType, form])

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

        {productType === "客梯" && (
          <>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>载重（千克）</FormLabel>
                    <Select onValueChange={(value) => {
                      field.onChange(value);
                      setIsCustomWeight(value === "custom");
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

              {isCustomWeight && (
                <FormField
                  control={form.control}
                  name="customWeight"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="200" 
                          max="10000" 
                          placeholder="请输入载重（200-10000）" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="earlyPayment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>轿厢宽度(毫米)</FormLabel>
                    <FormControl>
                      {Array.isArray(paymentOptions.early) ? (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="选择宽度" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {paymentOptions.early.map((amount) => (
                              <SelectItem key={amount} value={amount}>
                                {amount}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input 
                          type="number" 
                          min="1000" 
                          max="2000" 
                          placeholder="请输入宽度（1000-2000）" 
                          {...field} 
                        />
                      )}
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
                    <FormLabel>轿厢深度(毫米)</FormLabel>
                    <FormControl>
                      {Array.isArray(paymentOptions.late) ? (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="选择深度" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {paymentOptions.late.map((amount) => (
                              <SelectItem key={amount} value={amount}>
                                {amount}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input 
                          type="number" 
                          min="1000" 
                          max="2500" 
                          placeholder="请输入深度（1000-2500）" 
                          {...field} 
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
        )}

        <Button type="submit">提交</Button>
      </form>
    </Form>
  )
} 