import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-center"
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-primary group-[.toaster]:text-secondary group-[.toaster]:border-none group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-secondary",
          actionButton: "group-[.toast]:bg-secondary group-[.toast]:text-primary",
          cancelButton: "group-[.toast]:bg-secondary/10 group-[.toast]:text-secondary",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }