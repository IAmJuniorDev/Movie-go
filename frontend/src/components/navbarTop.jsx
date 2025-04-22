import "styles/navbar.css";

const NavbarTop = ()=>{
  return(
    <nav className="nav nav-top">
      <div className="nav-top-item"></div>
      <div className="nav-top-item">
        <h1>LOGO</h1>
      </div>
      <div className="nav-top-item userDetail">
        <p>login</p>
      </div>
    </nav>
  )
}

export default NavbarTop;