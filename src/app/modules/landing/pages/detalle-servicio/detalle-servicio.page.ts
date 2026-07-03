import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ModalAgenda } from '../../../../shared/components/modal-agenda/modal-agenda';

interface ServicioInfo {
  id: string;
  nombre: string;
  descripcionBreve: string;
  descripcionLarga: string;
  beneficios: string[];
  precioAproximado: string;
  duracionEstimada: string;
  imagenPath: string;
  recomendaciones: string[];
}

@Component({
  selector: 'app-detalle-servicio',
  imports: [CommonModule, RouterLink, ModalAgenda],
  templateUrl: './detalle-servicio.page.html',
  styleUrl: './detalle-servicio.page.scss',
})
export class DetalleServicioPage implements OnInit {
  servicioId: string = '';
  servicioActual: ServicioInfo | null = null;
  esModalAbierto: boolean = false;

  private readonly catalogoServicios: Record<string, ServicioInfo> = {
    'consulta-veterinaria': {
      id: 'consulta-veterinaria',
      nombre: 'Consulta Veterinaria Especializada',
      descripcionBreve: 'Atención médica general y especializada para el diagnóstico preciso de tu mascota.',
      descripcionLarga: 'Ofrecemos consultas exhaustivas lideradas por médicos veterinarios altamente calificados. Realizamos evaluaciones físicas completas, control de constantes biológicas y asesoramiento preventivo para garantizar que tu compañero reciba el tratamiento más adecuado según su etapa de vida y necesidades específicas.',
      beneficios: [
        'Evaluación física completa e integral.',
        'Diagnóstico temprano de afecciones o enfermedades.',
        'Orientación personalizada sobre nutrición y cuidado diario.',
        'Staff especializado disponible las 24 horas para urgencias.'
      ],
      precioAproximado: 'S/ 50 - S/ 80',
      duracionEstimada: '30 a 45 minutos',
      imagenPath: 'assets/images/vetidat.png',
      recomendaciones: [
        'Traer el carnet de vacunación e historial médico de la mascota.',
        'Si es posible, anotar síntomas previos observados en casa.',
        'Asegurar a tu mascota con correa o en su transportadora.'
      ]
    },
    'banio-y-corte': {
      id: 'banio-y-corte',
      nombre: 'Baño, Peluquería y Estética Canina/Felina',
      descripcionBreve: 'Servicio de aseo integral y corte de pelo adaptado a la raza de tu mascota.',
      descripcionLarga: 'Un servicio pensado en la higiene, estética y comodidad de tu mascota. Utilizamos champús especializados e hipoalergénicos según el tipo de piel y pelaje. Nuestro equipo experto realiza cortes de pelo específicos de raza o personalizados, limpieza de oídos, corte de uñas y vaciado de glándulas anales en un ambiente seguro y relajante.',
      beneficios: [
        'Piel sana y pelaje libre de nudos y suciedad.',
        'Detección oportuna de parásitos externos u anomalías dérmicas.',
        'Corte de uñas profesional para evitar lesiones en almohadillas.',
        'Uso de agua temperada y secadores profesionales silenciosos.'
      ],
      precioAproximado: 'S/ 40 - S/ 90 (según tamaño)',
      duracionEstimada: '1 a 2 horas',
      imagenPath: 'assets/images/siveriano.png',
      recomendaciones: [
        'Indicar si la mascota sufre de alergias dérmicas o problemas cardíacos.',
        'Informar si es sumamente nervioso para darle un manejo especial.',
        'Se recomienda agendar cita con anticipación para evitar esperas largas.'
      ]
    },
    'vacunacion': {
      id: 'vacunacion',
      nombre: 'Vacunación e Inmunización Preventiva',
      descripcionBreve: 'Protege a tu mascota contra las principales enfermedades infecciosas.',
      descripcionLarga: 'Implementamos protocolos de vacunación rigurosos según las directrices de salud animal locales e internacionales. Contamos con vacunas triples, quíntuples, antirrábicas y contra la tos de perrera para perros, así como vacunas triple felina y leucemia para gatos, todas conservadas en una estricta cadena de frío.',
      beneficios: [
        'Inmunidad efectiva contra virus mortales como Parvovirus, Distemper y Rabia.',
        'Cumplimiento con la normativa legal y requisitos de viaje.',
        'Protección indirecta a toda la familia (prevención de zoonosis).',
        'Registro y recordatorio digital de las próximas dosis.'
      ],
      precioAproximado: 'S/ 45 - S/ 75 por vacuna',
      duracionEstimada: '15 a 20 minutos',
      imagenPath: 'assets/images/oto.png',
      recomendaciones: [
        'La mascota debe encontrarse clínicamente sana para ser vacunada.',
        'Traer su cartilla física de vacunación para el registro oficial.',
        'Monitorear a la mascota las 12 horas posteriores a la aplicación.'
      ]
    },
    'desparasitacion': {
      id: 'desparasitacion',
      nombre: 'Desparasitación Interna y Externa',
      descripcionBreve: 'Eliminación y prevención de lombrices, pulgas, garrapatas y ácaros.',
      descripcionLarga: 'Planificamos tratamientos antiparasitarios personalizados utilizando los medicamentos más seguros y eficaces del mercado (pipetas, tabletas masticables y suspensiones orales). Protegemos el organismo de tu mascota contra parásitos intestinales, pulmonares y del corazón, además de repeler pulgas y garrapatas.',
      beneficios: [
        'Eliminación total de parásitos digestivos de forma segura.',
        'Prevención de la transmisión de enfermedades graves como la Ehrlichia.',
        'Mejora la absorción de nutrientes y vitalidad general.',
        'Ambiente del hogar más saludable para los humanos.'
      ],
      precioAproximado: 'S/ 20 - S/ 60',
      duracionEstimada: '15 minutos',
      imagenPath: 'assets/images/eco.png',
      recomendaciones: [
        'Realizar desparasitaciones preventivas cada 3 meses.',
        'Pesar correctamente a la mascota en la clínica para dosificar con precisión.',
        'Tratar a todas las mascotas del hogar simultáneamente.'
      ]
    },
    'esterilizacion': {
      id: 'esterilizacion',
      nombre: 'Cirugía de Esterilización y Castración',
      descripcionBreve: 'Procedimiento quirúrgico seguro para una vida más larga y tranquila.',
      descripcionLarga: 'Realizamos procedimientos de esterilización (ovariohisterectomía en hembras y orquiectomía en machos) bajo los más altos estándares quirúrgicos y de bioseguridad. Empleamos anestesia inhalatoria, monitoreo continuo de signos vitales y terapia analgésica preventiva para reducir al mínimo cualquier molestia postoperatoria.',
      beneficios: [
        'Previene camadas no deseadas y sobrepoblación animal.',
        'Disminuye el riesgo de tumores mamarios, infecciones uterinas y cáncer de próstata.',
        'Reduce conductas de marcaje de territorio, agresividad o fugas.',
        'Aumenta la expectativa y calidad de vida de tu mascota.'
      ],
      precioAproximado: 'S/ 150 - S/ 350 (según especie y peso)',
      duracionEstimada: 'De 2 a 4 horas (incluye recuperación)',
      imagenPath: 'assets/images/vetidat.png',
      recomendaciones: [
        'La mascota debe venir en ayuno estricto de sólidos y líquidos (8-12 horas).',
        'Contar con exámenes de sangre prequirúrgicos para garantizar seguridad.',
        'Tener listo un collar isabelino o faja postquirúrgica para el alta.'
      ]
    },
    'profilaxis': {
      id: 'profilaxis',
      nombre: 'Profilaxis Dental y Limpieza Ultrasónica',
      descripcionBreve: 'Higiene bucal profesional para eliminar sarro y prevenir mal aliento.',
      descripcionLarga: 'La salud dental influye directamente en el corazón y riñones de tu mascota. Mediante nuestro equipo de ultrasonido dental de última generación, eliminamos la placa bacteriana y el sarro acumulado sobre y debajo de las encías. El proceso concluye con un pulido dental para suavizar el esmalte y retrasar la acumulación futura de sarro.',
      beneficios: [
        'Eliminación del mal aliento crónico (halitosis).',
        'Previene la caída prematura de dientes y dolor al masticar.',
        'Evita infecciones bacterianas que migren a órganos vitales.',
        'Recupera el color blanco natural de las piezas dentales.'
      ],
      precioAproximado: 'S/ 120 - S/ 250',
      duracionEstimada: '1 a 2 horas (requiere sedación suave)',
      imagenPath: 'assets/images/oto.png',
      recomendaciones: [
        'Se requiere ayuno previo debido a la sedación ligera requerida.',
        'Se aconseja realizar chequeo preanestésico en mascotas adultas.',
        'Continuar con cepillado dental preventivo en casa después del tratamiento.'
      ]
    }
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.servicioId = params.get('id') || '';
      this.servicioActual = this.catalogoServicios[this.servicioId] || null;
    });
  }

  alternarModal(estado: boolean): void {
    this.esModalAbierto = estado;
  }
}
