import { useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@karma-wallet/ui/components/button";
import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerFooter,
  EmojiPickerSearch,
} from "@karma-wallet/ui/components/emoji-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@karma-wallet/ui/components/form";
import { Input } from "@karma-wallet/ui/components/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@karma-wallet/ui/components/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@karma-wallet/ui/components/select";
import { Textarea } from "@karma-wallet/ui/components/textarea";
import { useNavigate } from "@tanstack/react-router";
import { DollarSignIcon, SmilePlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";

import { db } from "@/db";
import { useSmartAccount } from "@/hooks";
import { sleep } from "@/lib/utils";

const formSchema = z.object({
  category: z.string(),
  currentAmount: z.number(),
  goal: z.string(),
  icon: z.string(),
  note: z.string().optional(),
  targetAmount: z.number(),
});

type FormData = z.infer<typeof formSchema>;

const goalCategories = [
  "Emergency Fund",
  "Vacation",
  "Home & Garden",
  "Transportation",
  "Education",
  "Technology",
  "Health & Fitness",
  "Entertainment",
  "Gifts & Events",
  "Other",
];

export const CreateGoalForm = () => {
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const { address } = useSmartAccount();
  const navigate = useNavigate();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    const id = toast.loading("Creating Goal...");
    await sleep("1s");
    await db.goals.add({
      _createdAt: new Date(),
      _updatedAt: new Date(),
      account: address ?? "0x0",
      category: data.category,
      currentAmount: data.currentAmount,
      emoji: data.icon,
      id: crypto.randomUUID(),
      isDefault: false,
      name: data.goal,
      note: data.note,
      targetAmount: data.targetAmount,
    });
    toast.success("Goal Created!", { id });
    await sleep("1s");
    form.reset();
    await navigate({ to: "/dashboard/goals" });
  };

  const emoji = form.watch("icon");
  const goal = form.watch("goal");
  const targetAmount = form.watch("targetAmount");
  const currentAmount = form.watch("currentAmount");
  const category = form.watch("category");

  const progress = useMemo(() => {
    if (!(targetAmount && currentAmount)) {
      return 0;
    }
    return Math.min(100, Math.round((currentAmount / targetAmount) * 100));
  }, [currentAmount, targetAmount]);

  return (
    <div className="mx-auto h-full w-full max-w-screen-md">
      <div className="flex flex-col">
        <div className="font-medium text-3xl">Create New Goal</div>
        <div className="text-neutral-400">
          Set up your savings goal and start your journey
        </div>
      </div>
      <div className="relative my-4 rounded-xl border border-neutral-400 border-dashed p-6">
        <div className="absolute top-4 right-4 rounded-xl border border-primary bg-primary/20 px-4 py-1 text-primary text-sm">
          {category ?? "Category"}
        </div>
        <div className="flex flex-row items-center gap-2">
          <div className="flex size-12 items-center justify-center rounded-xl border border-primary bg-primary/20">
            <div className="text-3xl">
              {emoji ?? <SmilePlusIcon className="text-primary" size={30} />}
            </div>
          </div>
          <div className="flex flex-col">
            <div className="font-medium text-lg">{goal ?? "Goal Name"}</div>
            <div className="font-medium text-neutral-700">
              ${currentAmount ?? 0} of ${targetAmount ?? 0}
            </div>
          </div>
        </div>
        <div className="space-y-2 pt-4">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-primary transition-all duration-300"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      </div>
      <Form {...form}>
        <form className="space-y-4 px-1" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-1">
            <div className="pb-1 font-medium text-sm">Goal Name</div>
            <div className="flex flex-row items-center gap-2">
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Popover
                        onOpenChange={setIsEmojiPickerOpen}
                        open={isEmojiPickerOpen}
                      >
                        <PopoverTrigger asChild={true}>
                          <Button
                            className="!text-xl"
                            size="icon"
                            type="button"
                            variant="outline"
                          >
                            {!emoji ? <SmilePlusIcon size={20} /> : emoji}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-fit p-0">
                          <EmojiPicker
                            className="h-[342px]"
                            onEmojiSelect={({ emoji }) => {
                              field.onChange(emoji);
                            }}
                          >
                            <EmojiPickerSearch />
                            <EmojiPickerContent />
                            <EmojiPickerFooter />
                          </EmojiPicker>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="goal"
                render={({ field }) => (
                  <FormItem className="w-full max-w-sm">
                    <FormControl>
                      <Input
                        className="w-full"
                        placeholder="eg- Vacation, New Car, etc"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex flex-row items-center gap-2">
            <div className="flex w-full max-w-xs flex-col">
              <div className="pb-1 font-medium text-sm">Target Amount</div>
              <div className="relative">
                <DollarSignIcon className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-gray-400" />
                <FormField
                  control={form.control}
                  name="targetAmount"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          className="pl-10"
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          placeholder="10000"
                          required={true}
                          type="number"
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex w-full max-w-xs flex-col">
              <div className="pb-1 font-medium text-sm">Current Amount</div>
              <div className="relative">
                <DollarSignIcon className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-gray-400" />
                <FormField
                  control={form.control}
                  name="currentAmount"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          className="pl-10"
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          placeholder="10000"
                          required={true}
                          type="number"
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger className="focus-visible:border-primary focus-visible:ring-primary/50">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {goalCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Note (optional)</FormLabel>
                <FormControl>
                  <Textarea
                    className="resize-none"
                    placeholder="Add any additional details about your goal, motivation, or specific plans..."
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Create Goal</Button>
        </form>
      </Form>
    </div>
  );
};
