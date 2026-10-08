import ServiceDetail from './ServiceDetail.jsx'

function Marketing() {
  return (
    <ServiceDetail
      serviceType="marketing"
      icon="📣"
      title="Marketing para mascotas"
      intro="Ideas que conectan marcas con quienes aman a los animales."
      description="Ayudamos a negocios y profesionales del sector pet a comunicar su propuesta, fortalecer su comunidad y crear relaciones duraderas con sus clientes."
      highlights={[
        'Campañas digitales para dar visibilidad a servicios y productos.',
        'Contenido para redes sociales alineado con la identidad de cada marca.',
        'Estrategias de fidelización para reconocer y mantener cerca a tus clientes.',
      ]}
      clientLabel="Nombre de contacto"
      entityLabel="Nombre del negocio"
      entityPlaceholder="Nombre de tu negocio"
    />
  )
}

export default Marketing
