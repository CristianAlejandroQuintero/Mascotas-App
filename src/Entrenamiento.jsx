import ServiceDetail from './ServiceDetail.jsx'

function Entrenamiento() {
  return (
    <ServiceDetail
      serviceType="entrenamiento"
      icon="🐾"
      title="Entrenamiento"
      intro="Aprender juntos hace más fuerte su vínculo."
      description="Programas de adiestramiento basados en el aprendizaje positivo, con objetivos adaptados a cada mascota y su familia."
      highlights={[
        'Programas para hábitos, obediencia básica y convivencia cotidiana.',
        'Sesiones prácticas para trabajar comunicación y habilidades paso a paso.',
        'Sesiones de relajación con actividades tranquilas que favorecen la calma y la confianza.',
      ]}
    />
  )
}

export default Entrenamiento
