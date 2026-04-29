import { useState } from 'react'
import isaImage from '../../../assets/images/ISA.jpg'
import ldsImage from '../../../assets/images/LDS.jpg'
import ledmImage from '../../../assets/images/LEDM.jpg'

const PROGRAMAS = [
  {
    id: 'software',
    image: ldsImage,
    alt: 'Ingenieria en Desarrollo de Software',
    area: 'Tecnologia',
    icon: '💻',
    duracion: '9 semestres',
    titleClass: 'home-programs__title--software',
    title: 'Ingenieria en Desarrollo de Software',
    descripcion:
      'Formacion en diseno, desarrollo e implementacion de sistemas de software y soluciones tecnologicas.',
  },
  {
    id: 'agro',
    image: isaImage,
    alt: 'Ingenieria en Sistemas Agroalimentarios',
    area: 'Sector Productivo',
    icon: '🌾',
    duracion: '9 semestres',
    titleClass: 'home-programs__title--agro',
    title: 'Ingenieria en Sistemas Agroalimentarios',
    descripcion:
      'Enfocada en la optimizacion de procesos agroalimentarios con enfoque sustentable y tecnologico.',
  },
  {
    id: 'mipymes',
    image: ledmImage,
    alt: 'Licenciatura en Emprendimiento y Desarrollo de MIPyMES',
    area: 'Negocios y Emprendimiento',
    icon: '📊',
    duracion: '8-9 semestres',
    titleClass: 'home-programs__title--mipymes',
    title: 'Licenciatura en Emprendimiento y Desarrollo de MIPyMES',
    descripcion:
      'Orientada a la creacion, gestion y fortalecimiento de micro, pequenas y medianas empresas.',
  },
]

const DETALLES_CARRERA = {
  software: {
    encabezado: 'Ingenieria en Desarrollo de Software',
    objetivoResumen:
      'Formar ingenieros en desarrollo de software con preparacion cientifica, tecnologica y humanista.',
    objetivoCapacidades: [
      'Disenar, desarrollar, implementar y mantener software.',
      'Crear soluciones innovadoras y de calidad.',
      'Contribuir al desarrollo tecnologico y social.',
    ],
    ingresoResumen:
      'Dirigido a estudiantes que concluyeron el bachillerato y tienen interes en tecnologias de la informacion.',
    ingresoCaracteristicas: [
      'Razonamiento logico',
      'Creatividad',
      'Capacidad de analisis',
      'Trabajo en equipo',
      'Disciplina',
      'Interes por la investigacion',
      'Interes por aprender idiomas',
    ],
    egresoCapacidades: [
      'Disenar y desarrollar software',
      'Implementar soluciones tecnologicas',
      'Administrar informacion',
      'Aplicar metodologias agiles',
      'Liderar proyectos tecnologicos',
    ],
    egresoTecnologias: ['Programacion', 'Bases de datos', 'Ciberseguridad'],
    egresoAdicional: [
      'Formacion etica',
      'Participacion en la transformacion digital',
      'Contribucion al desarrollo economico',
    ],
    campoAccion: [
      {
        titulo: 'Empresas de software',
        puntos: [
          'Desarrollo de sistemas',
          'Trabajo en equipos multidisciplinarios',
          'Sistemas distribuidos',
          'Analisis de datos',
        ],
      },
      {
        titulo: 'Sector publico y privado',
        puntos: [
          'Desarrollo de soluciones tecnologicas',
          'Gestion de recursos tecnologicos',
          'Evaluacion de proyectos: factibilidad tecnica, economica y operativa',
        ],
      },
    ],
    duracion: 'Aproximadamente 4 anos (8 semestres)',
    planEstudios: [
      {
        semestre: 'Primer semestre',
        materias: [
          'Programacion Estructurada',
          'Matematicas Discretas',
          'Etica y Responsabilidad Profesional',
          'Fundamentos de Matematicas para Ingenieria',
          'Habilidades de Comunicacion',
          'Ingles I',
        ],
      },
      {
        semestre: 'Segundo semestre',
        materias: [
          'Estructuras de Datos',
          'Teoria de Automatas',
          'Ingenieria de Requisitos',
          'Calculo',
          'Fundamentos de Electronica',
          'Ingles II',
        ],
      },
      {
        semestre: 'Tercer semestre',
        materias: [
          'Paradigmas de Programacion',
          'Base de Datos',
          'Ingenieria de Software',
          'Algebra Lineal',
          'Electronica Digital',
          'Ingles III',
        ],
      },
      {
        semestre: 'Cuarto semestre',
        materias: [
          'Diseno Web',
          'Derecho y Legislacion en el Desarrollo de Software',
          'Calidad de Software',
          'Computacion Numerica',
          'Programacion de Sistemas',
          'Ingles IV',
        ],
      },
      {
        semestre: 'Quinto semestre',
        materias: [
          'Sistemas Operativos',
          'Tecnologias Web I',
          'Administracion de Bases de Datos',
          'Modelos Probabilisticos y Analisis de Datos',
          'Arquitectura de Computadoras',
          'Ingles V',
        ],
      },
      {
        semestre: 'Sexto semestre',
        materias: [
          'Interaccion Humano-Computadora',
          'Tecnologias Web II',
          'Gestion de Productos de Software',
          'Analisis de Decisiones',
          'Redes de Computadoras',
          'Ingles VI',
        ],
      },
      {
        semestre: 'Septimo semestre',
        materias: [
          'Proyectos de Tecnologias de Informacion',
          'Ciberseguridad',
          'Computacion en la Nube',
          'Inteligencia Artificial',
          'Seguridad de Centros de Informatica',
          'Herramientas para la Comunicacion Profesional',
        ],
      },
      {
        semestre: 'Octavo semestre',
        materias: [
          'Desarrollo de Aplicaciones Moviles',
          'Inteligencia de Negocios',
          'Proyecto Integrador',
          'Ciencia de Datos',
          'Optativa I',
          'Optativa II',
        ],
      },
    ],
    optativas: [
      'Tecnologias de Informacion',
      'Diseno de Experiencia del Usuario',
      'Criptografia',
      'Emprendimiento de Empresas Emergentes de Software',
    ],
    enfoqueGeneral: [
      'Desarrollo de software',
      'Ingenieria de software',
      'Bases de datos',
      'Ciberseguridad',
      'Inteligencia artificial',
      'Ciencia de datos',
      'Innovacion tecnologica',
    ],
  },
  agro: {
    encabezado: 'Ingenieria en Sistemas Agroalimentarios',
    misionResumen:
      'Formar ingenieros con conocimientos en ciencias basicas, agronomia, produccion pecuaria y administracion.',
    misionCapacidades: [
      'Disenar soluciones innovadoras y sostenibles.',
      'Mejorar la produccion, transformacion y comercializacion de alimentos.',
      'Usar tecnologias modernas.',
      'Contribuir al desarrollo rural y al sector agroalimentario.',
    ],
    visionResumen:
      'Ser un programa educativo lider en formacion agroalimentaria, enfocado en sostenibilidad e innovacion.',
    visionImpacto: [
      'Seguridad alimentaria',
      'Desarrollo social, economico y ambiental',
    ],
    objetivoResumen: 'Actualmente en revision por autoridades universitarias.',
    objetivoCapacidades: [],
    ingresoResumen:
      'Dirigido a aspirantes con interes en ciencias naturales, agricultura, ganaderia y tecnologia, con bases en matematicas, biologia y quimica.',
    ingresoCaracteristicas: [
      'Actitud proactiva',
      'Responsabilidad ambiental',
      'Trabajo en equipo, especialmente en comunidades rurales',
      'Pensamiento critico y analitico',
      'Creatividad',
      'Interes en el desarrollo sostenible',
    ],
    egresoCapacidades: [
      'Disenar y gestionar sistemas agricolas y pecuarios',
      'Optimizar recursos naturales como suelo y agua',
      'Aplicar tecnologia al sector agroalimentario',
      'Mejorar procesos de produccion, transformacion y comercializacion',
    ],
    egresoTecnologias: [
      'Produccion',
      'Transformacion',
      'Comercializacion',
      'Tecnologia aplicada al campo',
    ],
    egresoAdicional: [
      'Administrar proyectos rurales',
      'Garantizar calidad e inocuidad alimentaria',
      'Integrar investigacion y tecnologia en soluciones reales',
      'Impulsar el desarrollo regional y comunitario',
    ],
    campoAccion: [
      {
        titulo: 'Produccion agricola y pecuaria',
        puntos: [
          'Diseno de sistemas productivos',
          'Optimizacion de recursos',
          'Uso de tecnologia en produccion',
        ],
      },
      {
        titulo: 'Transformacion y comercializacion',
        puntos: [
          'Procesamiento de alimentos',
          'Control de calidad',
          'Comercializacion agropecuaria',
        ],
      },
      {
        titulo: 'Desarrollo rural y sostenibilidad',
        puntos: [
          'Proyectos comunitarios',
          'Agricultura sostenible',
          'Conservacion de recursos naturales',
        ],
      },
      {
        titulo: 'Tecnologia y agroempresas',
        puntos: [
          'Uso de SIG (Sistemas de Informacion Geografica)',
          'Gestion de empresas agroalimentarias',
          'Innovacion tecnologica en el campo',
        ],
      },
    ],
    planEstudios: [
      {
        semestre: 'Primer semestre',
        materias: [
          'Agricultura Regional',
          'Habilidades de Comunicacion',
          'Agrobiologia',
          'Quimica Agricola',
          'Agrofisica',
        ],
      },
      {
        semestre: 'Segundo semestre',
        materias: [
          'Botanica',
          'Edafologia',
          'Meteorologia Agropecuaria',
          'Cultivos Basicos',
          'Bioquimica',
        ],
      },
      {
        semestre: 'Tercer semestre',
        materias: [
          'Fertilidad del Suelo y Nutricion Vegetal',
          'Fisiologia Vegetal',
          'Proteccion de Cultivos',
          'Produccion de Forrajes',
          'Estadistica',
        ],
      },
      {
        semestre: 'Cuarto semestre',
        materias: [
          'Produccion de Hortalizas',
          'Agroecologia',
          'Manejo Integrado Sustentable de Plagas',
          'Topografia Agricola',
          'Disenos Experimentales',
        ],
      },
      {
        semestre: 'Quinto semestre',
        materias: [
          'Fruticultura',
          'Fisiologia y Anatomia Animal',
          'Manejo y Conservacion del Suelo y del Agua',
          'Uso Eficiente del Agua',
          'Economia Agricola',
        ],
      },
      {
        semestre: 'Sexto semestre',
        materias: [
          'Genetica',
          'Alimentos y Alimentacion Animal',
          'Desarrollo Rural Sustentable',
          'Sistemas de Informacion Geografica',
          'Diseno y Gestion de Empresas Agropecuarias',
        ],
      },
      {
        semestre: 'Septimo semestre',
        materias: [
          'Biotecnologia',
          'Produccion de Flores y Ornamentales',
          'Sistemas de Produccion de Rumiantes',
          'Sistemas de Produccion de No Rumiantes',
          'Financiamiento del Sector Agropecuario',
        ],
      },
      {
        semestre: 'Octavo semestre',
        materias: [
          'Agricultura Protegida',
          'Produccion y Tecnologia de Semillas',
          'Fisiologia y Tecnologia Postcosecha',
          'Tecnologia de Productos Pecuarios',
          'Sistemas Productivos y Cadenas de Valor',
        ],
      },
    ],
    optativas: [],
    enfoqueGeneral: [
      'Produccion agricola y pecuaria',
      'Sustentabilidad',
      'Tecnologia aplicada al campo',
      'Transformacion de alimentos',
      'Gestion agroempresarial',
      'Desarrollo rural',
    ],
  },
  mipymes: {
    encabezado: 'Licenciatura en Emprendimiento y Desarrollo de MIPyMES',
    misionResumen:
      'Formar profesionistas emprendedores, con liderazgo, etica y compromiso social.',
    misionCapacidades: [
      'Gestionar MIPyMES inclusivas.',
      'Aplicar estrategias sostenibles.',
      'Impulsar el desarrollo economico y social en sus regiones.',
    ],
    visionResumen:
      'Ser una licenciatura referente en formacion empresarial, reconocida por su innovacion y enfocada en desarrollo sostenible.',
    visionImpacto: ['Comunidades de Oaxaca', 'Desarrollo economico y social'],
    objetivoResumen:
      'Formar profesionistas capaces de crear, liderar y transformar MIPyMES con innovacion y uso eficiente de recursos.',
    objetivoCapacidades: [
      'Gestion estrategica de empresas.',
      'Gestion sostenible.',
      'Gestion socialmente responsable.',
    ],
    ingresoResumen:
      'Dirigido a personas con espiritu emprendedor, interes en negocios y empresas, y compromiso con su comunidad.',
    ingresoCaracteristicas: [
      'Proactividad',
      'Trabajo en equipo',
      'Pensamiento critico',
      'Creatividad',
      'Interes en innovacion',
      'Conocimientos basicos en TIC',
      'Interes por el desarrollo social y economico',
    ],
    egresoCapacidades: [
      'Crear y dirigir MIPyMES',
      'Gestionar recursos empresariales',
      'Aplicar administracion, economia, finanzas y derecho empresarial',
      'Resolver problemas empresariales',
      'Contribuir al desarrollo regional sostenible',
    ],
    egresoTecnologias: ['Administracion', 'Economia', 'Finanzas', 'Derecho empresarial'],
    egresoAdicional: ['Liderazgo', 'Comunicacion', 'Negociacion'],
    campoAccion: [
      {
        titulo: 'Emprendimiento',
        puntos: ['Creacion de empresas', 'Desarrollo de proyectos innovadores'],
      },
      {
        titulo: 'Gestion empresarial',
        puntos: ['Administracion de MIPyMES', 'Optimizacion de procesos'],
      },
      {
        titulo: 'Consultoria',
        puntos: ['Planeacion estrategica', 'Finanzas', 'Marketing'],
      },
      {
        titulo: 'Innovacion e internacionalizacion',
        puntos: [
          'Desarrollo de nuevos productos y servicios',
          'Expansion a mercados globales',
        ],
      },
      {
        titulo: 'Recursos humanos',
        puntos: ['Formacion de talento', 'Gestion organizacional'],
      },
      {
        titulo: 'Academia y formacion',
        puntos: ['Docencia', 'Investigacion', 'Estudios de posgrado'],
      },
    ],
    duracion: '4 anos (8 semestres)',
    planEstudios: [
      {
        semestre: 'Primer semestre',
        materias: [
          'Contabilidad para MIPyMES',
          'Introduccion a la Administracion',
          'Fundamentos de Derecho',
          'Habilidades de Comunicacion',
          'Matematicas para la Administracion',
          'Ingles I',
        ],
      },
      {
        semestre: 'Segundo semestre',
        materias: [
          'Contabilidad de Costos',
          'Microeconomia',
          'Sociedad, Globalizacion y Multiculturalidad',
          'Desarrollo Sustentable',
          'Probabilidad y Estadistica',
          'Ingles II',
        ],
      },
      {
        semestre: 'Tercer semestre',
        materias: [
          'Matematicas Financieras',
          'Macroeconomia',
          'Derecho del Trabajo',
          'Metodologia de la Investigacion',
          'Herramientas Digitales para MIPyMES',
          'Ingles III',
        ],
      },
      {
        semestre: 'Cuarto semestre',
        materias: [
          'Gestion Financiera',
          'Derecho Empresarial',
          'Administracion de la Remuneracion',
          'Administracion de Empresas Familiares',
          'Investigacion de Mercados',
          'Ingles IV',
        ],
      },
      {
        semestre: 'Quinto semestre',
        materias: [
          'Planeacion Financiera Estrategica',
          'Administracion Estrategica',
          'Gestion del Talento Humano',
          'Etica y Responsabilidad Social Empresarial',
          'Mercadotecnia Estrategica',
          'Ingles V',
        ],
      },
      {
        semestre: 'Sexto semestre',
        materias: [
          'Administracion de Ventas',
          'Creatividad e Innovacion Empresarial',
          'Normatividad Fiscal para MIPyMES',
          'Investigacion de Operaciones',
          'Mercadotecnia Digital',
          'Ingles VI',
        ],
      },
      {
        semestre: 'Septimo semestre',
        materias: [
          'Desarrollo de Habilidades Gerenciales',
          'Proyectos de Inversion',
          'Desarrollo Regional y Local',
          'Calidad en el Producto y Servicio',
          'Gestion Logistica y Comercial',
          'Herramientas para la Comunicacion Profesional',
        ],
      },
      {
        semestre: 'Octavo semestre',
        materias: [
          'Direccion y Control Empresarial',
          'Emprendimiento de MIPyMES',
          'Internacionalizacion de MIPyMES',
          'Gestion del Cambio Organizacional',
          'Auditoria Administrativa',
        ],
      },
    ],
    optativas: [],
    enfoqueGeneral: [
      'Emprendimiento',
      'Administracion de empresas',
      'Finanzas',
      'Mercadotecnia',
      'Innovacion empresarial',
      'Desarrollo sostenible',
      'Gestion estrategica',
    ],
  },
}

export default function ProgramasPage() {
  const [carreraActiva, setCarreraActiva] = useState('software')
  const detalleActivo = DETALLES_CARRERA[carreraActiva]

  const handleActivate = (programaId) => {
    setCarreraActiva(programaId)
  }

  const handleCardKeyDown = (event, programaId) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleActivate(programaId)
    }
  }

  return (
    <main className="page-main programas-page">
      <section className="page-hero">
        <div className="page-hero__copy">
          <p className="eyebrow">Programas Academicos</p>
          <h1 className="page-hero__title">
            Oferta educativa especializada para el{' '}
            <span className="hero-highlight">desarrollo regional</span>
          </h1>
          <p className="page-hero__subtitle">
            NovaUniversitas ofrece programas enfocados en areas estrategicas con
            formacion profesional orientada a necesidades reales del entorno.
          </p>
        </div>
      </section>

      <section className="home-programs" aria-label="Areas de informacion de NovaUniversitas">
        <div className="home-programs__header">
          <p className="home-programs__eyebrow">Areas de informacion</p>
        </div>

        <div className="home-programs__grid">
          {PROGRAMAS.map((programa) => (
            <article
              aria-label={`Ver informacion de ${programa.title}`}
              aria-pressed={carreraActiva === programa.id}
              className={`home-programs__card${
                carreraActiva === programa.id ? ' is-selected' : ''
              }`}
              key={programa.title}
              onClick={() => handleActivate(programa.id)}
              onKeyDown={(event) => handleCardKeyDown(event, programa.id)}
              role="button"
              tabIndex={0}
            >
              <div className="home-programs__card-image">
                <img src={programa.image} alt={programa.alt} />
              </div>
              <div className="home-programs__card-content">
                <div className="programas-page__meta">
                  <p className="programas-page__area">
                    <span className="programas-page__area-icon" aria-hidden="true">
                      {programa.icon}
                    </span>
                    {programa.area}
                  </p>
                  <span className="programas-page__duracion">{programa.duracion}</span>
                </div>
                <h3 className={programa.titleClass}>{programa.title}</h3>
                <p>{programa.descripcion}</p>
                <span className="programas-page__cta">Presiona para ver informacion</span>
              </div>
            </article>
          ))}
        </div>

        <section className="programas-page__detalle" aria-live="polite">
          <h3 className="programas-page__detalle-titulo">{detalleActivo.encabezado}</h3>

          {detalleActivo.placeholder ? (
            <p className="programas-page__detalle-placeholder">{detalleActivo.resumen}</p>
          ) : (
            <>
              {detalleActivo.misionResumen ? (
                <article className="programas-page__bloque">
                  <h4>Mision</h4>
                  <p>{detalleActivo.misionResumen}</p>
                  {detalleActivo.misionCapacidades?.length ? (
                    <ul>
                      {detalleActivo.misionCapacidades.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              ) : null}

              {detalleActivo.visionResumen ? (
                <article className="programas-page__bloque">
                  <h4>Vision</h4>
                  <p>{detalleActivo.visionResumen}</p>
                  {detalleActivo.visionImpacto?.length ? (
                    <ul>
                      {detalleActivo.visionImpacto.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              ) : null}

              <article className="programas-page__bloque">
                <h4>Objetivo de la carrera</h4>
                <p>{detalleActivo.objetivoResumen}</p>
                {detalleActivo.objetivoCapacidades?.length ? (
                  <ul>
                    {detalleActivo.objetivoCapacidades.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </article>

              <article className="programas-page__bloque">
                <h4>Perfil de ingreso</h4>
                <p>{detalleActivo.ingresoResumen}</p>
                <ul>
                  {detalleActivo.ingresoCaracteristicas.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>

              <article className="programas-page__bloque">
                <h4>Perfil de egreso</h4>
                <ul>
                  {detalleActivo.egresoCapacidades.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className="programas-page__subtitulo">Trabajara con:</p>
                <ul>
                  {detalleActivo.egresoTecnologias.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className="programas-page__subtitulo">Ademas:</p>
                <ul>
                  {detalleActivo.egresoAdicional.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>

              <article className="programas-page__bloque">
                <h4>Campo de accion</h4>
                {detalleActivo.campoAccion.map((item) => (
                  <div className="programas-page__campo" key={item.titulo}>
                    <p className="programas-page__subtitulo">{item.titulo}</p>
                    <ul>
                      {item.puntos.map((punto) => (
                        <li key={punto}>{punto}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </article>

              {detalleActivo.duracion ? (
                <article className="programas-page__bloque">
                  <h4>Duracion</h4>
                  <p>{detalleActivo.duracion}</p>
                </article>
              ) : null}

              <article className="programas-page__bloque programas-page__bloque--plan">
                <h4>Plan de estudios completo</h4>
                <div className="programas-page__semestres-grid">
                  {detalleActivo.planEstudios.map((semestre) => (
                    <section className="programas-page__semestre" key={semestre.semestre}>
                      <h5>{semestre.semestre}</h5>
                      <ul>
                        {semestre.materias.map((materia) => (
                          <li key={materia}>{materia}</li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
              </article>

              {detalleActivo.optativas?.length ? (
                <article className="programas-page__bloque">
                  <h4>Materias optativas</h4>
                  <ul>
                    {detalleActivo.optativas.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ) : null}

              <article className="programas-page__bloque">
                <h4>Enfoque general de la carrera</h4>
                <ul>
                  {detalleActivo.enfoqueGeneral.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            </>
          )}
        </section>
      </section>
    </main>
  )
}
