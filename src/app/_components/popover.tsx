import {Dialog, Popover, type PopoverProps} from 'react-aria-components';

interface MyPopoverProps extends Omit<PopoverProps, 'children'> {
  children: React.ReactNode;
}

export const PopoverComponent = ({ children, ...props }: MyPopoverProps) => {
  return (
    <Popover {...props}>
      <Dialog>
        {children}
      </Dialog>
    </Popover>
  );
}
