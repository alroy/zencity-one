"use client"

import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { BarChart3, FileText, FileEdit, Send, Users, Globe, BoxIcon as Toolbox } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function MoreActionsMenu() {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)

  const handleAction = (action: string) => {
    toast({
      title: "Action Selected",
      description: `You selected: ${action}`,
      duration: 3000,
    })
    setOpen(false)
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button className="h-10 px-3 flex items-center gap-2 bg-[#3BD1BB]/10 hover:bg-[#3BD1BB]/20 text-[#3BD1BB] border border-[#3BD1BB]/30 font-medium">
          <Toolbox className="h-4 w-4" />
          TOOLKIT
          <span className="sr-only">More actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Sentiment Control</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => handleAction("Request an insight")}>
            <BarChart3 className="mr-2 h-4 w-4 text-[#3BD1BB]" />
            <span>Request an insight</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAction("Create a project")}>
            <FileText className="mr-2 h-4 w-4 text-[#3BD1BB]" />
            <span>Create a project</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAction("Create a custom digest")}>
            <FileEdit className="mr-2 h-4 w-4 text-[#3BD1BB]" />
            <span>Create a custom digest</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAction("Publish a post")}>
            <Send className="mr-2 h-4 w-4 text-[#3BD1BB]" />
            <span>Publish a post</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuLabel>Ask your residents</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => handleAction("Conduct a survey")}>
            <Users className="mr-2 h-4 w-4 text-[#3BD1BB]" />
            <span>Conduct a survey</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAction("Launch an online engagement")}>
            <Globe className="mr-2 h-4 w-4 text-[#3BD1BB]" />
            <span>Launch an online engagement</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
