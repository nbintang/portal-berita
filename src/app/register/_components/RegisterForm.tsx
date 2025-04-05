"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dropzone,
  DropZoneArea,
  DropzoneTrigger,
  DropzoneMessage,
  useDropzone,
} from "@/components/ui/dropzone";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const formSchema = z.object({
  name: z.string().min(1),
  image: z.string().optional(), // URL hasil upload
});

export default function RegisterForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      image: undefined,
    },
  });

  const dropzone = useDropzone({
    onDropFile: async (file: File) => {
      console.log("File dropped:", file);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const imageUrl = URL.createObjectURL(file);

      form.setValue("image", imageUrl);
      return {
        status: "success",
        result: imageUrl,
      };
    },
    validation: {
      accept: {
        "image/*": [".png", ".jpg", ".jpeg"],
      },
      maxSize: 10 * 1024 * 1024,
      maxFiles: 1,
    },
    shiftOnMaxFiles: true,
  });

  const avatarSrc = dropzone.fileStatuses[0]?.result;
  const isPending = dropzone.fileStatuses[0]?.status === "pending";

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log("Submitted:", values);
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>,
      );
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto max-w-3xl space-y-8 py-5"
      >
        {/* Username */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your username"
                  type="text"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image Upload */}
        <FormField
          control={form.control}
          name="image"
          render={() => (
            <FormItem>
              <FormLabel>Profile Image (optional)</FormLabel>
              <Dropzone {...dropzone}>
                <DropZoneArea className="flex items-center justify-start">
                  <DropzoneTrigger className="flex items-center gap-8 bg-transparent text-sm">
                    <Avatar className={cn(isPending && "animate-pulse")}>
                      <AvatarImage className="object-cover" src={avatarSrc} />
                      <AvatarFallback>AV</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1 font-semibold">
                      <p>Upload a new avatar</p>
                      <p className="text-muted-foreground text-xs">
                        Please select an image smaller than 10MB
                      </p>
                    </div>
                  </DropzoneTrigger>
                </DropZoneArea>
              </Dropzone>
              {form.formState.errors.image?.message && (
                <div className="flex justify-between">
                  <DropzoneMessage>
                    {form.formState.errors.image.message}
                  </DropzoneMessage>
                </div>
              )}

              <FormDescription>Select an image to upload.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
