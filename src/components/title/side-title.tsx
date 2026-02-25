import Fadeup from "../ui/fadeup";

const SideTitle = ({ title }: { title: string }) => {
  return (
    <Fadeup delay={0.2}>
      <p className="absolute top-0 right-[105%] font-medium text-[15px] text-muted-foreground/50 capitalize w-fit text-nowrap hidden lg:block">
        {title}
      </p>
    </Fadeup>
  );
};

export default SideTitle;
