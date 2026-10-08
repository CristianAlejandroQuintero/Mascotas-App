import ServiceDetail from './ServiceDetail.jsx'

function Estetica() {
  return (
    <ServiceDetail
      serviceType="estetica"
      icon="✂️"
      title="Estética para mascotas"
      intro="Un momento de cuidado, higiene y muchos mimos."
      description="Adaptamos cada sesión al tipo de pelaje y las necesidades de tu mascota, con paciencia y productos adecuados para su cuidado."
      highlights={[
        'Baño y secado cuidadoso según su tipo de piel y pelaje.',
        'Corte higiénico o de estilo, conversado previamente contigo.',
        'Cepillado y arreglo para ayudar a mantener su pelaje limpio y ordenado.',
      ]}
    />
  )
}

export default Estetica
