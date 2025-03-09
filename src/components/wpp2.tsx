import { FaWhatsapp } from 'react-icons/fa';
import Link from 'next/link'

export default function Wpp() {
  return (
    <Link
      href="https://wa.me/553199754441?text=Olá"
      className="fixed bottom-5 right-5 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 z-50"
      target="_blank"
      rel="noopener noreferrer"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <FaWhatsapp size={40} />
    </Link>
  );
}