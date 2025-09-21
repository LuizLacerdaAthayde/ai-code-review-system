import cls from "./Button.module.css";

type Variant = "solid" | "ghost" | "danger";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export default function Button({ variant="solid", className="", ...rest }: Props){
  const classes = [cls.btn, variant !== "solid" ? cls[variant] : "", className].join(" ");
  return <button {...rest} className={classes} />;
}
