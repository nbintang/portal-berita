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
import { Checkbox } from "@/components/ui/checkbox";

const registerSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  image: z.string().optional(), // URL hasil upload
  acceptedTOS: z.boolean().refine((val) => val === true, {
    message: "You must accept the Terms of Service",
  }),
});

export default function RegisterForm() {
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      image: undefined,
      acceptedTOS: false,
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

  function onSubmit(values: z.infer<typeof registerSchema>) {
    try {
      console.log("Submitted:", values);
      const unFormattedFullName = `${values.firstName} ${values.lastName}`;
      // cut the space  just 1 space
      const fullName = unFormattedFullName.replace(/\s+/g, " ").trim();
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">
            {JSON.stringify(
              {
                fullName,
                image: values.image,
                acceptedTOS: values.acceptedTOS,
              },
              null,
              2,
            )}
          </code>
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
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your first name"
                  type="text"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your last name"
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
                    <Avatar
                      className={cn(isPending && "animate-pulse", "size-20")}
                    >
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
        <FormField
          control={form.control}
          name="acceptedTOS"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>I Accept Terms of Services</FormLabel>
                <FormDescription>
                  You can manage your mobile notifications in the mobile
                  settings page.
                </FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
