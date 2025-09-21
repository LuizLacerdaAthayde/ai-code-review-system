import { NavLink, Link } from "react-router-dom";
import s from "./Layout.module.css";

export default function Layout({ children }: React.PropsWithChildren){
  return (
    <>
      <header className={s.header}>
        <div className="container" style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 24px"}}>
          <Link to="/" className={s.brand}>AI Code Review</Link>
          <nav className={s.nav}>
            {[
              {to:"/submit", label:"Submit"},
              {to:"/history", label:"History"},
              {to:"/dashboard", label:"Dashboard"},
            ].map(i=>(
              <NavLink key={i.to} to={i.to} className={({isActive}) => [s.link, isActive? s.active : ""].join(" ")}>{i.label}</NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="container" style={{paddingTop:24}}>
        {children}
      </main>
    </>
  );
}
