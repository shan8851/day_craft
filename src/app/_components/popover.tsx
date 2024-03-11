import {Dialog, Popover, type PopoverProps} from 'react-aria-components';

interface MyPopoverProps extends Omit<PopoverProps, 'children'> {
  children: React.ReactNode;
}

export const PopoverComponent = ({ children, ...props }: MyPopoverProps) => {
  return (
    <Popover
    {...props}
    className='py-2 px-4 border border-grey-200 rounded-xl bg-white'
    >
      <Dialog>
        {children}
      </Dialog>
    </Popover>
  );
}
