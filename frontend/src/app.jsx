import { useEffect, useState } from 'react'
import {
  Alert,
  Badge,
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Spinner,
} from 'reactstrap'

function App() {
  const [estadoApi, setEstadoApi] = useState('cargando')
  const [integrantes, setIntegrantes] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    async function cargarDatos() {
      try {
        const [respuestaHealth, respuestaInfo] = await Promise.all([
          fetch('/api/health'),
          fetch('/api/info'),
        ])

        if (!respuestaHealth.ok || !respuestaInfo.ok) {
          throw new Error('La API respondió con un error.')
        }

        const datosHealth = await respuestaHealth.json()
        const datosInfo = await respuestaInfo.json()

        setEstadoApi(datosHealth.status === 'ok' ? 'conectada' : 'conectada')

        // Acepta que /api/info devuelva un arreglo o un objeto con la propiedad integrantes.
        const lista = Array.isArray(datosInfo)
          ? datosInfo
          : datosInfo.integrantes ?? []

        setIntegrantes(lista)
      } catch (err) {
        setEstadoApi('error')
        setError(err.message || 'No se pudo conectar con la API.')
      }
    }

    cargarDatos()
  }, [])

  return (
    <Container className="pagina">
      <header className="encabezado">
        <p className="sobrelinea">Taller IV · Integrantes</p>
        <h1>Taller IV</h1>
        <p className="bajada">
          Información del grupo y estado de conexión con la API.
        </p>
      </header>

      <section className="estado" aria-live="polite">
        {estadoApi === 'cargando' && (
          <Alert color="info" className="estado-alerta">
            <Spinner size="sm" /> Conectando con la API...
          </Alert>
        )}

        {estadoApi === 'conectada' && (
          <Alert color="success" className="estado-alerta">
            El API está funcionando.
          </Alert>
        )}

        {estadoApi === 'error' && (
          <Alert color="danger" className="estado-alerta">
            No se pudo cargar la información: {error}
          </Alert>
        )}
      </section>

      <section className="integrantes">
        <div className="seccion-titulo">
          <h2>Integrantes</h2>
          <Badge color="dark">{integrantes.length}</Badge>
        </div>

        {estadoApi === 'conectada' && integrantes.length === 0 && (
          <p className="sin-datos">La API no devolvió integrantes.</p>
        )}

        <Row>
          {integrantes.map((integrante, indice) => (
            <Col key={integrante.id ?? integrante.nombre ?? indice} xs="12" md="6">
              <Card className="tarjeta-integrante">
                <CardBody>
                  <h3>{integrante.nombre}</h3>
                  <p>
                    <strong>Edad:</strong> {integrante.edad}
                  </p>
                  <p>
                    <strong>Carrera:</strong> {integrante.carrera}
                  </p>
                  <p className="materias">
                    <strong>Materias aprobadas:</strong>{' '}
                    {integrante.materiasAprobadas}
                  </p>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </section>
    </Container>
  )
}

export default App