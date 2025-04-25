import Fadeup from "../ui/fadeup";

const MainTitle = ({ title, subTitle }) => {
  return (
    <div className="">
      <Fadeup delay={0.1} duration={0.5}>
        <p className="capitalize text-2xl font-semibold tracking-wide text-indigo-400">
          {title}
        </p>
      </Fadeup>
      <Fadeup delay={0.2} duration={0.5}>
        <p className="capitalize text-lg font-medium text-gray-600">
          {subTitle}
        </p>
      </Fadeup>
    </div>
  );
};

export default MainTitle;
