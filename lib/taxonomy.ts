export interface TaxonomySkillDefinition {
  name: string;
  category: string;
  description: string;
  isEmerging: boolean;
  demandIndex: number;
  aliases: string[];
}

export const MAHARASHTRA_SKILL_TAXONOMY: TaxonomySkillDefinition[] = [
  // EV & Clean Mobility
  {
    name: 'Battery Management Systems',
    category: 'EV & Clean Mobility',
    description: 'Architecture, state estimation (SoC, SoH), cell balancing, and thermal management for EV battery packs.',
    isEmerging: true,
    demandIndex: 94,
    aliases: ['bms', 'battery management system', 'bms calibration', 'battery management', 'bms firmware', 'cell balancing'],
  },
  {
    name: 'Battery Diagnostics',
    category: 'EV & Clean Mobility',
    description: 'Electrochemical impedance spectroscopy, fault diagnosis, degradation analysis, and pack disassembly.',
    isEmerging: true,
    demandIndex: 91,
    aliases: ['battery diagnostics', 'battery health testing', 'soh testing', 'pack testing', 'battery testing', 'cell diagnostics'],
  },
  {
    name: 'EV Safety Protocols',
    category: 'EV & Clean Mobility',
    description: 'High-voltage safety standards (AIS-038/AIS-156), PPE procedures, interlock systems, and emergency cut-off.',
    isEmerging: true,
    demandIndex: 88,
    aliases: ['ev safety', 'high voltage safety', 'hv safety', 'electric vehicle safety', 'ais 038', 'ais 156', 'hv interlock'],
  },
  {
    name: 'Charging Infrastructure',
    category: 'EV & Clean Mobility',
    description: 'AC Level 2, DC Fast Charging standards (CCS2, CHAdeMO), OCPP protocols, and grid interconnection.',
    isEmerging: true,
    demandIndex: 85,
    aliases: ['charging infrastructure', 'ev charging', 'dc fast charging', 'ccs2', 'ocpp', 'evse', 'charging stations'],
  },
  {
    name: 'Traction Motor & Inverter Control',
    category: 'EV & Clean Mobility',
    description: 'PMSM and BLDC motor operation, Field-Oriented Control (FOC), power electronics inverter tuning.',
    isEmerging: false,
    demandIndex: 78,
    aliases: ['traction motor', 'inverter control', 'pmsm', 'bldc', 'motor drives', 'foc control'],
  },

  // Industry 4.0 & Advanced Manufacturing
  {
    name: 'PLC Programming',
    category: 'Industry 4.0 & Automation',
    description: 'Ladder logic, structured text, and function block programming on Siemens, Allen-Bradley, and Delta PLCs.',
    isEmerging: false,
    demandIndex: 86,
    aliases: ['plc', 'plc programming', 'programmable logic controller', 'ladder logic', 'siemens s7', 'allen bradley'],
  },
  {
    name: 'SCADA Systems',
    category: 'Industry 4.0 & Automation',
    description: 'Supervisory control, HMI screen design, alarming, telemetry, and industrial historian databases.',
    isEmerging: false,
    demandIndex: 80,
    aliases: ['scada', 'scada systems', 'supervisory control', 'hmi', 'wonderware', 'wincc'],
  },
  {
    name: 'Industrial Robotics',
    category: 'Industry 4.0 & Automation',
    description: 'Articulated robotic arm teach pendant programming, kinematics, welding/pick-and-place cell commissioning (KUKA, ABB, Fanuc).',
    isEmerging: true,
    demandIndex: 89,
    aliases: ['industrial robotics', 'robotics', 'kuka', 'fanuc', 'abb robot', 'robotic arm', 'robot programming'],
  },
  {
    name: 'IoT Sensors & Edge Gateway',
    category: 'Industry 4.0 & Automation',
    description: 'Industrial sensor interfacing (Modbus, IO-Link, MQTT), edge microcontrollers, vibration/temperature condition monitoring.',
    isEmerging: true,
    demandIndex: 87,
    aliases: ['iot sensors', 'iot', 'internet of things', 'edge gateway', 'modbus', 'mqtt', 'iiot', 'industrial iot'],
  },
  {
    name: 'Digital Twin Modeling',
    category: 'Industry 4.0 & Automation',
    description: 'Physics-based virtual commissioning and simulation of manufacturing lines using Siemens Tecnomatix or Dassault 3DEXPERIENCE.',
    isEmerging: true,
    demandIndex: 82,
    aliases: ['digital twin', 'digital twins', 'virtual commissioning', 'plant simulation', 'tecnomatix'],
  },

  // Software, Cloud & AI
  {
    name: 'Python',
    category: 'Software & Data',
    description: 'Core Python, object-oriented programming, data structures, and script automation.',
    isEmerging: false,
    demandIndex: 92,
    aliases: ['python', 'py', 'python3', 'python 3'],
  },
  {
    name: 'React',
    category: 'Software & Data',
    description: 'Component architecture, state management, hooks, and responsive web frontend engineering.',
    isEmerging: false,
    demandIndex: 90,
    aliases: ['react', 'reactjs', 'react.js', 'react js'],
  },
  {
    name: 'Node.js',
    category: 'Software & Data',
    description: 'Server-side JavaScript runtime, event-loop programming, RESTful microservices, and asynchronous architecture.',
    isEmerging: false,
    demandIndex: 85,
    aliases: ['node', 'nodejs', 'node.js', 'node js'],
  },
  {
    name: 'Machine Learning',
    category: 'Software & Data',
    description: 'Supervised/unsupervised algorithms, feature engineering, scikit-learn, PyTorch, model evaluation.',
    isEmerging: true,
    demandIndex: 93,
    aliases: ['machine learning', 'ml', 'scikit-learn', 'deep learning', 'pytorch', 'tensorflow'],
  },
  {
    name: 'Cloud Computing & DevOps',
    category: 'Software & Data',
    description: 'Docker containerization, CI/CD pipelines, Kubernetes orchestration, cloud infrastructure (AWS/GCP/Azure).',
    isEmerging: false,
    demandIndex: 89,
    aliases: ['devops', 'cloud computing', 'aws', 'docker', 'kubernetes', 'ci/cd', 'cloud architecture'],
  },

  // Green Energy & Sustainability
  {
    name: 'Solar PV System Design',
    category: 'Renewable Energy',
    description: 'Rooftop and utility solar array sizing, string inverter calculation, PVsyst simulation, and net-metering compliance.',
    isEmerging: false,
    demandIndex: 81,
    aliases: ['solar pv', 'solar design', 'pvsyst', 'solar engineering', 'solar power', 'photovoltaics'],
  },
  {
    name: 'Green Hydrogen Electrolysis',
    category: 'Renewable Energy',
    description: 'PEM and alkaline electrolyzer operations, stack efficiency, hydrogen compression, and ATEX zone safety.',
    isEmerging: true,
    demandIndex: 86,
    aliases: ['green hydrogen', 'hydrogen', 'electrolyzer', 'pem electrolysis', 'hydrogen storage'],
  },

  // Electronics & Embedded
  {
    name: 'Embedded C & Microcontrollers',
    category: 'Electronics & Hardware',
    description: 'Firmware development in Embedded C/C++ on ARM Cortex-M (STM32, ESP32), UART/SPI/I2C communication.',
    isEmerging: false,
    demandIndex: 84,
    aliases: ['embedded c', 'embedded systems', 'microcontrollers', 'stm32', 'esp32', 'firmware', 'arm cortex'],
  },
  {
    name: 'PCB Design & Testing',
    category: 'Electronics & Hardware',
    description: 'Schematic capture, multi-layer layout, EMI/EMC compliance, Altium Designer, KiCad, and board bring-up.',
    isEmerging: false,
    demandIndex: 79,
    aliases: ['pcb design', 'pcb', 'altium', 'kicad', 'circuit design', 'board layout'],
  },
];

export const MAHARASHTRA_DISTRICTS = [
  'Pune',
  'Mumbai City',
  'Mumbai Suburban',
  'Thane',
  'Nagpur',
  'Nashik',
  'Chhatrapati Sambhaji Nagar', // Aurangabad
  'Kolhapur',
  'Solapur',
  'Amravati',
  'Satara',
  'Ahmednagar',
  'Jalgaon',
  'Raigad',
  'Palghar',
  'Sangli',
  'Nanded',
  'Dhule',
  'Latur',
  'Chandrapur',
  'Yavatmal',
  'Parbhani',
  'Jalna',
  'Buldhana',
  'Beed',
  'Gondia',
  'Wardha',
  'Bhandara',
  'Gadchiroli',
  'Hingoli',
  'Osmanabad', // Dharashiv
  'Washim',
  'Ratnagiri',
  'Sindhudurg',
  'Nandurbar'
];
