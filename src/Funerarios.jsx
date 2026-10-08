import ServiceDetail from './ServiceDetail.jsx'

function Funerarios() {
  return (
    <ServiceDetail
      serviceType="funerarios"
      icon="🌈"
      title="Servicios funerarios"
      intro="Un adiós respetuoso para una vida inolvidable."
      description="Acompañamos a las familias con sensibilidad y claridad para que puedan despedirse de su compañero de la manera que consideren adecuada."
      highlights={[
        'Orientación sobre protocolos de despedida respetuosos.',
        'Información y coordinación de opciones de cremación.',
        'Guía sobre alternativas de entierro y los requisitos que puedan aplicar.',
      ]}
    />
  )
}

export default Funerarios
