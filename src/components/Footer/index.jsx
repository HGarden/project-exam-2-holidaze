import './footer.css'

function Footer() {
  return (
    <footer className="footer footer-center bg-base-200 text-base-content p-6 mt-12">
      <aside>
        <p>© {new Date().getFullYear()} Holidaze</p>
      </aside>
    </footer>
  )
}

export default Footer