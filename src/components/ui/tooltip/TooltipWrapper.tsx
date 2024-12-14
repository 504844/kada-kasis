import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface TooltipWrapperProps {
  content: React.ReactNode;
  children: React.ReactNode;
}

export function TooltipWrapper({ content, children }: TooltipWrapperProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>{content}</TooltipContent>
    </Tooltip>
  );
}