import ServiceDetail from './ServiceDetail.jsx'

function Veterinaria() {
  return (
    <ServiceDetail
      serviceType="veterinaria"
      icon="🩺"
      title="Veterinaria"
      intro="Su salud, en manos que cuidan."
      description="Acompañamos a tu mascota en cada etapa con atención cercana, prevención y orientación para su bienestar."
      highlights={[
        'Consultas generales para revisar su salud y resolver tus dudas.',
        'Vacunas y orientación sobre el calendario indicado para cada etapa.',
        'Cuidados preventivos, controles periódicos y recomendaciones para el hogar.',
      ]}
    />
  )
}

export default Veterinaria
