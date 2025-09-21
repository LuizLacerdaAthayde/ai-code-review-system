import s from "./Field.module.css";

export const Label: React.FC<React.PropsWithChildren> = ({children}) => (
  <label className={s.label}>{children}</label>
);

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>){
  return <input {...props} className={s.input} />;
}
export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>){
  return <select {...props} className={s.select} />;
}
export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>){
  return <textarea {...props} className={s.textarea} />;
}
export const Row: React.FC<React.PropsWithChildren> = ({children}) => (
  <div className={s.row}>{children}</div>
);
