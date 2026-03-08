import { FaEnvelope, FaGithub, FaYoutube } from 'react-icons/fa'

export default function HomeSocial() {
  return (
    <section className='flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-8'>
      <h1>Support Developer</h1>
      <div className='flex items-center gap-5'>
        <SocialLink
          href='https://github.com/irfanshadikrishad'
          icon={<FaGithub className='text-black/80' />}
          label='GitHub'
        />
        <SocialLink
          href='https://www.youtube.com/@irfanshadikrishad'
          icon={<FaYoutube className='text-black/80' />}
          label='YouTube'
        />
        <SocialLink
          href='mailto:support@irfanshadikrishad.uk'
          icon={<FaEnvelope className='text-black/80' />}
          label='Email'
        />
      </div>
    </section>
  )
}

function SocialLink({ href, icon, label }) {
  return (
    <a
      href={href}
      target='_blank'
      rel='noopener'
      aria-label={label}
      className='rounded-full border border-white/5 bg-white/5 p-3 text-2xl text-gray-300 transition-all duration-300 hover:scale-110 hover:bg-white/10 hover:text-white'
    >
      {icon}
    </a>
  )
}
