import { contactLink } from '../utils/whatsapp'
import { WhatsAppIcon } from './Icons'

export default function WhatsAppFloat() {
  return (
    <a className="wa-float" href={contactLink()} target="_blank" rel="noopener noreferrer" aria-label="Falar no WhatsApp">
      <WhatsAppIcon size={28} />
    </a>
  )
}
