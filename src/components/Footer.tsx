export default function Footer() {
    return (
      <footer className="bg-[#16578d] text-white py-4 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hak Cipta */}
          <div className="text-center">
            <p>&copy; {new Date().getFullYear()} Sistem Informasi Indeks Kualitas Kebijakan. Supprorted by Tanoto Foundation.</p>
          </div>
        </div>
      </footer>
    )
  }
  