/**
 * BioCell Lab - Guided Educational Scenarios
 * Structured interactive learning modules covering key biological phenomena:
 * Photosynthesis, Cellular Respiration, Osmosis, Mitosis, and Cell Injury (Apoptosis vs Necrosis).
 */

export interface ScenarioStep {
  stepNumber: number;
  titleVi: string;
  instructionVi: string;
  conceptExplanationVi: string;
  targetTab: 'microscope' | 'photosynthesis' | 'respiration' | 'osmosis' | 'division' | 'injury';
  presetAction: {
    kingdom?: string;
    specificCellId?: string;
    lightIntensity?: number;
    co2Ppm?: number;
    temperature?: number;
    spectrum?: 'white' | 'red' | 'blue' | 'green';
    glucoseLevelMm?: number;
    o2Percent?: number;
    isFermentationForced?: boolean;
    soluteConcentration?: number;
    hasCellWall?: boolean;
    divisionProgress?: number;
    injuryType?: 'normal' | 'hypotonic_shock' | 'antibiotic' | 'apoptosis' | 'necrosis';
    organelleHighlight?: string;
    speed?: number;
  };
  interactiveTaskVi: string;
  checkpointQuestion: {
    questionVi: string;
    optionsVi: string[];
    correctIndex: number;
    explanationVi: string;
  };
  takeawayVi: string;
}

export interface EducationalScenario {
  id: string;
  titleVi: string;
  titleEn: string;
  category: 'photosynthesis' | 'respiration' | 'osmosis' | 'mitosis' | 'cell_injury';
  difficulty: 'Cơ bản' | 'Nâng cao' | 'Chuyên sâu';
  estimatedMinutes: number;
  iconName: string;
  summaryVi: string;
  contextVi: string;
  learningObjectivesVi: string[];
  steps: ScenarioStep[];
}

export const EDUCATIONAL_SCENARIOS: EducationalScenario[] = [
  {
    id: 'scenario_photosynthesis_calvin',
    titleVi: 'Hành Trình Quang Hợp: Từ Photon Ánh Sáng Đến Glucose',
    titleEn: 'Photosynthesis: From Photons to Glucose',
    category: 'photosynthesis',
    difficulty: 'Cơ bản',
    estimatedMinutes: 8,
    iconName: 'Sun',
    summaryVi: 'Khám phá chuỗi phản ứng sáng tại màng thylakoid và chu trình Calvin trong chất nền stroma. Phân tích định luật Liebig và hiệu ứng ánh sáng lục.',
    contextVi: 'Quang hợp là phản ứng sinh hóa nền tảng duy trì sự sống trên Trái Đất, biến đổi 100 tỷ tấn carbon vô cơ thành sinh khối mỗi năm. Tại sao lá cây lại có màu xanh lục? Khi đóng khí khổng vào buổi trưa nắng gắt thì điều gì xảy ra với chu trình Calvin?',
    learningObjectivesVi: [
      'Giải thích quang phân ly nước và sự hình thành O2 ở pha sáng',
      'Phân tích dòng luân chuyển phân tử năng lượng ATP và NADPH sang pha tối',
      'Hiểu rõ cơ chế xúc tác của enzyme Rubisco trong Chu trình Calvin',
      'Vận dụng Định luật yếu tố giới hạn Blackman & Liebig để tối ưu nhà kính',
    ],
    steps: [
      {
        stepNumber: 1,
        titleVi: 'Bước 1: Khởi động pha sáng tại Hạt Grana (Thylakoid)',
        instructionVi: 'Quan sát chùm photon chiếu vào phức hệ diệp lục ở màng thylakoid. Nước (H₂O) bị quang phân ly giải phóng bọt khí Oxy (O₂).',
        conceptExplanationVi: 'Ánh sáng kích thích electron tại diệp lục P680 của Photosystem II. Nước bị tách thành 4H⁺ + 4e⁻ + O₂. Gradient nồng độ H⁺ qua màng thylakoid làm quay rotor ATP Synthase.',
        targetTab: 'photosynthesis',
        presetAction: { lightIntensity: 65, co2Ppm: 600, temperature: 28, spectrum: 'white', speed: 1 },
        interactiveTaskVi: 'Kéo thanh "Cường độ ánh sáng" lên 80 kLux và quan sát tốc độ sinh bọt khí O₂ tăng vọt.',
        checkpointQuestion: {
          questionVi: 'Toàn bộ khí Oxy (O₂) giải phóng ra trong quang hợp có nguồn gốc từ đâu?',
          optionsVi: [
            'Từ sự phân giải của khí CO₂ trong chu trình Calvin',
            'Từ phản ứng quang phân ly nước (H₂O) tại pha sáng',
            'Từ sự thoái hóa phân tử Glucose',
            'Từ chất hữu cơ dự trữ trong không bào',
          ],
          correctIndex: 1,
          explanationVi: 'Thí nghiệm đồng vị phóng xạ O¹⁸ của Ruben và Kamen chứng minh 100% Oxy sinh ra bắt nguồn từ quang phân ly nước tại thylakoid.',
        },
        takeawayVi: 'Pha sáng biến quang năng thành hóa năng trong ATP và NADPH, giải phóng O₂ làm sản phẩm phụ.',
      },
      {
        stepNumber: 2,
        titleVi: 'Bước 2: Cố định CO₂ tại Chu trình Calvin trong Stroma',
        instructionVi: 'Theo dõi các phân tử ATP và NADPH từ thylakoid di chuyển vào chất nền Stroma để cung cấp năng lượng cho chu trình Calvin.',
        conceptExplanationVi: 'Enzyme Rubisco kết hợp CO₂ với hợp chất 5 carbon RuBP để tạo thành 3-PGA, sau đó được khử thành đường G3P/PGAL rồi tổng hợp thành Glucose (C₆H₁₂O₆).',
        targetTab: 'photosynthesis',
        presetAction: { lightIntensity: 75, co2Ppm: 900, temperature: 28, spectrum: 'white', speed: 1 },
        interactiveTaskVi: 'Quan sát bánh đà chu trình Calvin quay tít và đồng hồ đo Glucose đạt mức > 25 mg/h.',
        checkpointQuestion: {
          questionVi: 'Enzyme nào đóng vai trò then chốt nhất trong việc cố định CO₂ ở pha tối?',
          optionsVi: [
            'ATP Synthase',
            'Enzyme Rubisco (Ribulose-1,5-bisphosphate carboxylase/oxygenase)',
            'Enzyme Catalase',
            'DNA Polymerase',
          ],
          correctIndex: 1,
          explanationVi: 'Rubisco là enzyme phổ biến nhất hành tinh, chiếm tới 50% tổng lượng protein tan trong lá cây xanh.',
        },
        takeawayVi: 'Pha tối không cần ánh sáng trực tiếp nhưng bắt buộc phải có ATP và NADPH từ pha sáng cung cấp.',
      },
      {
        stepNumber: 3,
        titleVi: 'Bước 3: Thí nghiệm Engelmann & Bí ẩn màu xanh của lá',
        instructionVi: 'Chuyển bước sóng ánh sáng sang "Ánh sáng lục (530 nm)" và quan sát đồ thị tốc độ quang hợp.',
        conceptExplanationVi: 'Diệp lục a và b chỉ hấp thụ mạnh ở dải màu xanh lam (~430-450 nm) và đỏ (~660 nm). Ánh sáng màu lục hầu như bị phản xạ hoặc truyền qua, do đó mắt người nhìn thấy lá có màu xanh.',
        targetTab: 'photosynthesis',
        presetAction: { lightIntensity: 70, co2Ppm: 800, temperature: 28, spectrum: 'green', speed: 1 },
        interactiveTaskVi: 'Chọn tab "Lục" trên thanh quang phổ và xem cảnh báo "Bị giới hạn bởi bước sóng ánh sáng lục".',
        checkpointQuestion: {
          questionVi: 'Tại sao khi chiếu ánh sáng thuần màu lục thì tốc độ quang hợp giảm sút nghiêm trọng?',
          optionsVi: [
            'Vì ánh sáng lục làm chết tế bào lá ngay lập tức',
            'Vì diệp lục phản xạ phần lớn ánh sáng lục và hấp thụ rất kém bước sóng này',
            'Vì ánh sáng lục làm enzyme Rubisco bị đông đặc',
            'Vì khí CO₂ không tan được dưới ánh sáng lục',
          ],
          correctIndex: 1,
          explanationVi: 'Quang phổ hấp thụ của diệp lục có thung lũng cực thấp ở vùng 500-550 nm (màu lục), phản xạ lại ánh sáng này tạo màu xanh cho lá cây.',
        },
        takeawayVi: 'Trồng cây trong nhà kính nên ưu tiên chiếu bổ sung đèn LED xanh lam và đỏ để đạt sinh khối tối đa.',
      },
    ],
  },
  {
    id: 'scenario_respiration_fermentation',
    titleVi: 'Khủng Hoảng Năng Lượng: Hô Hấp Hiếu Khí vs Lên Men Kị Khí',
    titleEn: 'Energy Crisis: Aerobic Respiration vs Fermentation',
    category: 'respiration',
    difficulty: 'Nâng cao',
    estimatedMinutes: 10,
    iconName: 'Flame',
    summaryVi: 'Khảo sát 4 giai đoạn hô hấp tế bào: Đường phân, biến đổi Pyruvate, chu trình Krebs và chuỗi truyền electron màng trong ty thể. Khám phá tại sao thiếu oxy tế bào chỉ tạo được 2 ATP.',
    contextVi: 'Khi cơ bắp chạy nước rút 100m, oxy máu không kịp cung cấp. Làm thế nào tế bào vẫn tiếp tục sinh ATP để cơ co? Tại sao nấm men khi ủ kín lại sinh rượu và bọt khí làm nở bánh mì?',
    learningObjectivesVi: [
      'Nắm vững sản lượng ATP từng giai đoạn (Đường phân: 2 ATP, Krebs: 2 ATP, Chuỗi ETC: 32 ATP)',
      'Giải thích cơ chế hóa thẩm thấu (Chemiosmosis) của gradient proton H+ trên màng trong ty thể',
      'So sánh lên men Lactic ở cơ người với lên men Rượu ở nấm men',
      'Định lượng hiệu suất năng lượng giữa hiếu khí (~40%) và kị khí (~2%)',
    ],
    steps: [
      {
        stepNumber: 1,
        titleVi: 'Bước 1: Hô hấp hiếu khí toàn diện trong Ty thể (36 ATP)',
        instructionVi: 'Cung cấp đủ Glucose (8 mM) và Oxy (21%). Quan sát quá trình oxy hóa triệt để pyruvate diễn ra trong chất nền ty thể và màng mào cristae.',
        conceptExplanationVi: 'Các phân tử NADH và FADH₂ mang electron giàu năng lượng đến chuỗi truyền electron (ETC). Bơm proton tạo gradient điện hóa làm quay động cơ nano ATP Synthase.',
        targetTab: 'respiration',
        presetAction: { glucoseLevelMm: 8, o2Percent: 21, temperature: 37, isFermentationForced: false, kingdom: 'animal', speed: 1 },
        interactiveTaskVi: 'Quan sát rotor ATP Synthase quay ở tốc độ cao sinh ra ~36 ATP trên mỗi phân tử Glucose.',
        checkpointQuestion: {
          questionVi: 'Giai đoạn nào của hô hấp tế bào tạo ra nhiều phân tử ATP nhất?',
          optionsVi: [
            'Đường phân (Glycolysis) tại bào tương',
            'Chu trình Krebs tại chất nền ty thể',
            'Chuỗi truyền electron và Hóa thẩm thấu tại màng trong ty thể',
            'Phản ứng khử carboxyl của axit pyruvic',
          ],
          correctIndex: 2,
          explanationVi: 'Chuỗi truyền electron và hóa thẩm thấu tạo ra tới 32-34 ATP nhờ thế điện hóa H+, vượt trội so với 2 ATP ở đường phân và 2 ATP ở Krebs.',
        },
        takeawayVi: 'Ty thể là nhà máy điện năng lượng tối cao, giúp sinh vật đa bào có đủ năng lượng cho hoạt động phức tạp.',
      },
      {
        stepNumber: 2,
        titleVi: 'Bước 2: Cắt giảm Oxy và Chuyển hướng sang Lên Men Kị Khí',
        instructionVi: 'Kéo thanh Oxy xuống 0%. Quan sát chuỗi truyền electron ngừng hoạt động và ty thể trở nên bất động.',
        conceptExplanationVi: 'Khi thiếu chất nhận electron cuối cùng là Oxy, chuỗi ETC bị tắc nghẽn, NADH không thể trả proton tại ty thể. Tế bào bắt buộc phải dùng pyruvate nhận H+ để tái sinh NAD+, tạo ra Axit Lactic hoặc Ethanol.',
        targetTab: 'respiration',
        presetAction: { glucoseLevelMm: 8, o2Percent: 0, temperature: 37, isFermentationForced: true, kingdom: 'animal', speed: 1 },
        interactiveTaskVi: 'Chọn kịch bản "Lên men Axit Lactic" và quan sát sản lượng ATP tụt dốc từ 36 xuống vỏn vẹn 2 ATP.',
        checkpointQuestion: {
          questionVi: 'Mục đích sinh học tối quan trọng của quá trình lên men khi tế bào thiếu oxy là gì?',
          optionsVi: [
            'Tạo ra thêm nhiều khí CO₂ để thở',
            'Tái sinh coenzyme NAD⁺ từ NADH để duy trì chu trình Đường phân tiếp tục sinh 2 ATP sống còn',
            'Đốt cháy hoàn toàn phân tử axit lactic',
            'Hút thêm nước vào bên trong tế bào',
          ],
          correctIndex: 1,
          explanationVi: 'Nếu không có lên men để oxy hóa NADH trở lại thành NAD+, đường phân sẽ cạn kiệt NAD+ và dừng lại hoàn toàn, tế bào chết vì mất sạch ATP.',
        },
        takeawayVi: 'Lên men là phao cứu sinh khẩn cấp của tế bào trong điều kiện yếm khí, chấp nhận lãng phí 98% năng lượng còn sót lại trong sản phẩm phụ.',
      },
      {
        stepNumber: 3,
        titleVi: 'Bước 3: Lên Men Rượu ở Nấm Men (Saccharomyces) & Khí CO₂',
        instructionVi: 'Chuyển sang quan sát nấm men kị khí. Khảo sát phản ứng khử carboxyl sinh bọt khí CO₂ và ethanol.',
        conceptExplanationVi: 'Nấm men chuyển hóa pyruvate thành acetaldehyde kèm giải phóng khí CO₂, sau đó khử acetaldehyde thành ethanol để giải phóng NAD⁺. Ứng dụng rộng rãi trong làm bánh mì xốp và sản xuất bia rượu.',
        targetTab: 'respiration',
        presetAction: { glucoseLevelMm: 12, o2Percent: 0, isFermentationForced: true, kingdom: 'fungi', speed: 1 },
        interactiveTaskVi: 'Chọn mẫu sinh vật Nấm men (Fungi) và xem bọt khí CO₂ sủi tăm cùng ethanol tạo thành.',
        checkpointQuestion: {
          questionVi: 'Tại sao khi ủ bột làm bánh mì với men nở (nấm men), khối bột lại phồng to và có nhiều lỗ xốp?',
          optionsVi: [
            'Do nấm men hấp thụ hết nước làm bột khô cứng',
            'Do khí CO₂ sinh ra từ quá trình lên men rượu bị giữ lại trong mạng lưới gluten của bột',
            'Do nhiệt độ lò nướng làm nấm men sinh sản vô tính',
            'Do enzyme amylase biến bột thành khí oxy',
          ],
          correctIndex: 1,
          explanationVi: 'Khí CO2 thoát ra trong quá trình lên men rượu bị nhốt trong mạng lưới protein gluten đàn hồi của bột mì, tạo ra hàng triệu bong bóng khí làm bánh xốp mềm khi nướng.',
        },
        takeawayVi: 'Lên men rượu là một trong những công nghệ sinh học cổ xưa nhất và quan trọng nhất của loài người.',
      },
    ],
  },
  {
    id: 'scenario_osmosis_injury',
    titleVi: 'Sốc Thẩm Thấu & Tổn Thương Màng Tế Bào',
    titleEn: 'Osmotic Shock & Cell Membrane Injury',
    category: 'osmosis',
    difficulty: 'Cơ bản',
    estimatedMinutes: 7,
    iconName: 'Droplets',
    summaryVi: 'Mô phỏng phản ứng của tế bào động vật và thực vật khi đặt vào các môi trường thẩm thấu khắc nghiệt. Hiện tượng tan máu (Hemolysis) vs co nguyên sinh (Plasmolysis).',
    contextVi: 'Tại sao khi truyền dịch cho bệnh nhân bắt buộc phải dùng nước muối sinh lý 0.9% (300 mOsm/L) mà tuyệt đối không được truyền nước cất tinh khiết? Tại sao cây trồng bị tưới nước phân quá đậm đặc lại héo rũ chết?',
    learningObjectivesVi: [
      'Phân biệt bản chất dung dịch Nhược trương, Đẳng trương và Ưu trương',
      'Giải thích cơ chế tan bào (Lysis) ở tế bào động vật do thiếu thành cellulose bảo vệ',
      'Quan sát hiện tượng Co nguyên sinh (Plasmolysis) và Trương nước (Turgor) ở thực vật',
      'Ứng dụng hiện tượng thẩm thấu trong y học hồi sức và bảo quản nông sản',
    ],
    steps: [
      {
        stepNumber: 1,
        titleVi: 'Bước 1: Tế bào hồng cầu trong môi trường Đẳng trương (300 mOsm/L)',
        instructionVi: 'Quan sát tế bào hồng cầu ở trạng thái cân bằng sinh lý. Dòng nước đi vào và đi ra qua kênh Aquaporin với lưu lượng bằng nhau.',
        conceptExplanationVi: 'Nồng độ chất tan nội bào và ngoại bào tương đương nhau (~300 mOsm/L). Tế bào duy trì dạng đĩa lõm hai mặt dẻo dai giúp luồn lách qua các mao mạch nhỏ.',
        targetTab: 'osmosis',
        presetAction: { soluteConcentration: 300, hasCellWall: false, speed: 1 },
        interactiveTaskVi: 'Kiểm tra trạng thái hình thái được đánh giá là "AN TOÀN / Cân bằng động".',
        checkpointQuestion: {
          questionVi: 'Dung dịch nào sau đây là đẳng trương với máu người?',
          optionsVi: [
            'Nước cất tinh khiết',
            'Dung dịch NaCl 0.9% (Nước muối sinh lý)',
            'Dung dịch Glucose 50%',
            'Nước biển tự nhiên',
          ],
          correctIndex: 1,
          explanationVi: 'Dung dịch NaCl 0.9% có áp suất thẩm thấu ~308 mOsm/L, cân bằng đẳng trương hoàn hảo với huyết tương người.',
        },
        takeawayVi: 'Môi trường đẳng trương bảo tồn hình thái và chức năng hô hấp của tế bào máu.',
      },
      {
        stepNumber: 2,
        titleVi: 'Bước 2: Sốc nhược trương và Vỡ màng tế bào (Tan bào)',
        instructionVi: 'Kéo nồng độ dung dịch xuống 80 mOsm/L (nước cất nhược trương). Quan sát nước tràn ồ ạt vào tế bào.',
        conceptExplanationVi: 'Áp suất thẩm thấu nội bào cao hơn hút nước từ ngoài vào. Tế bào động vật không có thành tế bào chịu lực nên màng sinh chất bị kéo căng vượt ngưỡng đàn hồi và rách vỡ tung (Hemolysis).',
        targetTab: 'osmosis',
        presetAction: { soluteConcentration: 80, hasCellWall: false, speed: 1 },
        interactiveTaskVi: 'Xem hiệu ứng nổ rách màng và huyết cầu tố Hemoglobin tràn ra ngoại bào.',
        checkpointQuestion: {
          questionVi: 'Tại sao tế bào thực vật khi ngâm vào nước cất không bị vỡ tung như hồng cầu?',
          optionsVi: [
            'Vì tế bào thực vật không có màng sinh chất',
            'Vì thành tế bào cellulose vững chắc tạo áp suất trương chống lại dòng nước ùa vào',
            'Vì tế bào thực vật không chứa nước',
            'Vì nước cất không thể đi qua lỗ màng thực vật',
          ],
          correctIndex: 1,
          explanationVi: 'Thành tế bào cellulose có độ bền kéo cao, khi không bào hút nước ép sát màng vào thành sẽ sinh ra lực đối áp cản nước vào thêm, giữ cây tươi tốt.',
        },
        takeawayVi: 'Thành tế bào là một phát minh tiến hóa vĩ đại giúp thực vật và vi khuẩn sống được trong nước ngọt.',
      },
      {
        stepNumber: 3,
        titleVi: 'Bước 3: Môi trường Ưu trương & Hiện tượng Co nguyên sinh (Plasmolysis)',
        instructionVi: 'Đặt mẫu thực vật vào dung dịch ưu trương 700 mOsm/L (nước muối mặn). Quan sát tế bào chất co rút tách khỏi thành tế bào.',
        conceptExplanationVi: 'Áp suất thẩm thấu ngoại bào lớn hơn hút nước từ không bào ra ngoài. Màng sinh chất co rúm dạt về phía tâm, tách rời khỏi thành cellulose cứng cáp.',
        targetTab: 'osmosis',
        presetAction: { soluteConcentration: 700, hasCellWall: true, speed: 1 },
        interactiveTaskVi: 'Chọn loại tế bào "Thực vật (Có thành cellulose)" và kéo nồng độ lên 700 mOsm/L để xem co nguyên sinh.',
        checkpointQuestion: {
          questionVi: 'Khi làm món dưa chua hoặc ướp muối vào thịt cá, tại sao vi khuẩn gây ôi thiu không phát triển được?',
          optionsVi: [
            'Vì muối làm biến mất oxy',
            'Vì môi trường ưu trương nồng độ muối cao hút cạn nước của tế bào vi khuẩn gây co nguyên sinh và ngừng sinh sản',
            'Vì muối làm lạnh tế bào',
            'Vì vi khuẩn biến thành muối',
          ],
          correctIndex: 1,
          explanationVi: 'Nồng độ muối ưu trương làm nước trong tế bào vi khuẩn thẩm thấu ra ngoài, tế bào vi khuẩn bị co nguyên sinh và tê liệt hoạt động trao đổi chất.',
        },
        takeawayVi: 'Ưu trương là nguyên lý bảo quản thực phẩm kinh điển của nhân loại từ thời cổ đại.',
      },
    ],
  },
  {
    id: 'scenario_cell_injury',
    titleVi: 'Tổn Thương Tế Bào: Chết Theo Chương Trình (Apoptosis) vs Hoại Tử (Necrosis)',
    titleEn: 'Cell Injury: Programmed Death (Apoptosis) vs Necrosis',
    category: 'cell_injury',
    difficulty: 'Chuyên sâu',
    estimatedMinutes: 12,
    iconName: 'ShieldAlert',
    summaryVi: 'Nghiên cứu tổn thương bệnh học tế bào: Sự khác biệt bản chất giữa cái chết tự sát êm đềm có kiểm soát (Apoptosis) và cái chết vỡ tung gây viêm nhiễm (Necrosis), cùng cơ chế kháng sinh phá vách vi khuẩn.',
    contextVi: 'Mỗi ngày trong cơ thể con người có hơn 50 tỷ tế bào già cỗi hoặc đột biến tự tiêu hủy mà chúng ta không hề sốt hay đau đớn. Nhưng khi bị nhồi máu cơ tim hay bỏng nặng, tại sao mô lại sưng viêm dữ dội?',
    learningObjectivesVi: [
      'Phân biệt cơ chế phân tử giữa Chết theo chương trình (Apoptosis) và Hoại tử (Necrosis)',
      'Nhận diện các dấu hiệu hình thái: Nổi bóng màng (blebbing), ngưng kết chromatin, thể apoptotic',
      'Hiểu vai trò của enzyme phân cắt Caspase và enzyme ti thể Cytochrome c',
      'Khám phá cơ chế thuốc kháng sinh Penicillin phá vỡ thành peptidoglycan vi khuẩn',
    ],
    steps: [
      {
        stepNumber: 1,
        titleVi: 'Bước 1: Chết theo chương trình (Apoptosis - Tự sát sinh lý)',
        instructionVi: 'Kích hoạt con đường Apoptosis. Quan sát nhân tế bào co cụm, màng sinh chất nổi các bóng phồng (blebs) và tế bào phân cắt thành các thể apoptotic bodies gọn gàng.',
        conceptExplanationVi: 'Tín hiệu tổn thương ADN hoặc thụ thể Fas kích hoạt enzyme Caspase. ADN bị cắt thành các đoạn ngắn 180-200 bp. Màng sinh chất phơi bày Phosphatidylserine ra mặt ngoài làm tín hiệu "Eat me" để đại thực bào dọn dẹp không để lại phản ứng viêm.',
        targetTab: 'injury',
        presetAction: { injuryType: 'apoptosis', speed: 1 },
        interactiveTaskVi: 'Bật mô phỏng Apoptosis và quan sát sự hình thành các túi apoptotic bodies.',
        checkpointQuestion: {
          questionVi: 'Đặc điểm nào phân biệt rõ ràng nhất Apoptosis với Hoại tử (Necrosis)?',
          optionsVi: [
            'Apoptosis không làm vỡ màng sinh chất và không gây phản ứng viêm mô xung quanh',
            'Apoptosis chỉ xảy ra ở tế bào vi khuẩn',
            'Apoptosis luôn làm nhiệt độ cơ thể tăng vọt',
            'Apoptosis không tiêu tốn năng lượng ATP',
          ],
          correctIndex: 0,
          explanationVi: 'Trong Apoptosis, màng tế bào vẫn nguyên vẹn bọc lấy các thể apoptotic nên các enzyme tiêu hóa nội bào không tràn ra ngoài, hoàn toàn tránh được phản ứng viêm.',
        },
        takeawayVi: 'Apoptosis là cơ chế tự vệ thiết yếu giúp loại bỏ tế bào tiền ung thư và điêu khắc ngón tay, ngón chân trong phôi thai học.',
      },
      {
        stepNumber: 2,
        titleVi: 'Bước 2: Hoại tử tế bào (Necrosis - Chết do tổn thương cấp tính)',
        instructionVi: 'Mô phỏng tình huống thiếu máu cục bộ / cạn kiệt ATP đột ngột. Quan sát ti thể và tế bào phồng to rồi vỡ bung.',
        conceptExplanationVi: 'Mất ATP làm bơm Na⁺/K⁺ tê liệt, ion và nước tràn vào làm trương phồng tế bào. Màng sinh chất rách toạc, các enzyme lysosome có tính axit tràn ra mô kẽ, kích hoạt hệ thống miễn dịch gây viêm, đau đớn và sưng phù.',
        targetTab: 'injury',
        presetAction: { injuryType: 'necrosis', speed: 1 },
        interactiveTaskVi: 'Chuyển sang chế độ "Hoại tử (Necrosis)" và quan sát các mảnh vỡ tế bào giải phóng chất gây viêm.',
        checkpointQuestion: {
          questionVi: 'Hậu quả trực tiếp của việc màng sinh chất bị rách toạc trong Hoại tử (Necrosis) là gì?',
          optionsVi: [
            'Tế bào tự động nhân đôi thêm lần nữa',
            'Các enzyme nội bào và chất trung gian giải phóng ra ngoài kích hoạt phản ứng viêm cấp tính',
            'Tế bào biến thành tế bào thực vật',
            'Tế bào hấp thụ thêm nhiều glucose',
          ],
          correctIndex: 1,
          explanationVi: 'Khi màng vỡ, các chất DAMPs (Damage-Associated Molecular Patterns) và enzyme tiêu hóa tràn ra ngoài kích hoạt bạch cầu gây phản ứng viêm.',
        },
        takeawayVi: 'Hoại tử là quá trình bệnh lý thụ động, gây tổn thương lan rộng cho các tế bào lân cận.',
      },
      {
        stepNumber: 3,
        titleVi: 'Bước 3: Tác động của Kháng sinh phá vách Vi khuẩn',
        instructionVi: 'Thử nghiệm thuốc kháng sinh Penicillin lên tế bào vi khuẩn Gram (+). Quan sát sự ức chế tổng hợp cầu nối peptidoglycan.',
        conceptExplanationVi: 'Kháng sinh nhóm $\\beta$-lactam liên kết bất thuận nghịch với enzyme Transpeptidase (PBP), ngăn chặn liên kết chéo giữa các chuỗi peptidoglycan. Vách vi khuẩn yếu đi và vi khuẩn vỡ tan dưới áp suất thẩm thấu nội bào.',
        targetTab: 'injury',
        presetAction: { injuryType: 'antibiotic', kingdom: 'bacteria', speed: 1 },
        interactiveTaskVi: 'Áp dụng kháng sinh và quan sát vách vi khuẩn bị thủng lỗ chỗ dẫn tới tan khuẩn.',
        checkpointQuestion: {
          questionVi: 'Tại sao thuốc kháng sinh Penicillin tiêu diệt được vi khuẩn nhưng hoàn toàn vô hại đối với tế bào người?',
          optionsVi: [
            'Vì tế bào người có kích thước lớn hơn vi khuẩn',
            'Vì tế bào người không có thành Peptidoglycan (đích tác dụng đặc hiệu của Penicillin)',
            'Vì tế bào người tự phân hủy được thuốc kháng sinh',
            'Vì vi khuẩn không thể hấp thụ được nước',
          ],
          correctIndex: 1,
          explanationVi: 'Nguyên lý độc tính chọn lọc trong hóa trị liệu: Tế bào người là tế bào động vật không có vách peptidoglycan nên thuốc không có đích gắn kết gây độc.',
        },
        takeawayVi: 'Hiểu biết siêu vi về cấu tạo tế bào là nền tảng để chế tạo các loại thuốc nhắm trúng đích cứu sống hàng triệu người.',
      },
    ],
  },
  {
    id: 'scenario_mitosis_checkpoint',
    titleVi: 'Phân Chia Di Truyền: Nguyên Phân & Điểm Kiểm Soát Thoi Vô Sắc',
    titleEn: 'Mitosis & The Spindle Assembly Checkpoint',
    category: 'mitosis',
    difficulty: 'Nâng cao',
    estimatedMinutes: 9,
    iconName: 'GitBranch',
    summaryVi: 'Theo dõi từng mili-giây quá trình đóng xoắn, xếp hàng và phân ly của các nhiễm sắc thể. Vai trò của thể động kinetochore và nguy cơ lệch bội tế bào ung thư.',
    contextVi: 'Trong mỗi giây có khoảng 3.8 triệu tế bào trong cơ thể bạn thực hiện nguyên phân để thay thế tế bào chết. Làm thế nào tế bào đảm bảo 46 nhiễm sắc thể phân chia hoàn hảo 100% không thừa không thiếu?',
    learningObjectivesVi: [
      'Phân tích đặc điểm nhận dạng 4 kỳ nguyên phân: Đầu, Giữa, Sau, Cuối',
      'Hiểu cơ chế kéo rút của thoi phân bào (vi ống thể động kinetochore microtubules)',
      'Giải thích điểm kiểm soát thoi vô sắc (SAC - Spindle Assembly Checkpoint)',
      'So sánh phân chia tế bào chất ở tế bào động vật (thắt eo) và thực vật (vách ngăn cell plate)',
    ],
    steps: [
      {
        stepNumber: 1,
        titleVi: 'Bước 1: Kỳ giữa (Metaphase) & Mặt phẳng xích đạo',
        instructionVi: 'Dừng mô phỏng ở mốc 50% tiến trình. Quan sát các nhiễm sắc thể kép co xoắn cực đại và dàn thành một hàng thẳng tắp.',
        conceptExplanationVi: 'Các vi ống thoi phân bào từ hai cực gắn vào tâm động (kinetochore) của mỗi chromatid. Điểm kiểm soát thoi phân bào (SAC) kiểm tra lực căng cơ học; chỉ khi tất cả 46 NST đều gắn đúng vào thoi thì tín hiệu phân ly mới được bật.',
        targetTab: 'division',
        presetAction: { divisionProgress: 50, speed: 0.5 },
        interactiveTaskVi: 'Dùng thanh điều khiển thời gian đặt tốc độ 0.5x để quan sát mặt phẳng xích đạo.',
        checkpointQuestion: {
          questionVi: 'Tại sao nhiễm sắc thể lại co xoắn ngắn cực đại ở Kỳ giữa?',
          optionsVi: [
            'Để dễ dàng di chuyển và phân ly đồng đều mà không bị đứt gãy hoặc rối xoắn vào nhau',
            'Để hút thêm nước vào trong nhân tế bào',
            'Để giải phóng bọt khí oxy',
            'Để tiêu hóa các bào quan già cỗi',
          ],
          correctIndex: 0,
          explanationVi: 'Sự co xoắn chặt chẽ giúp các sợi ADN dài hàng mét đóng gói thành các cấu trúc ngắn vững chắc, giúp thoi phân bào kéo tách an toàn.',
        },
        takeawayVi: 'Kỳ giữa là thời điểm chụp ảnh nhiễm sắc thể đồ (Karyotype) chuẩn xác nhất để chẩn đoán bệnh di truyền.',
      },
      {
        stepNumber: 2,
        titleVi: 'Bước 2: Kỳ sau (Anaphase) - Phân ly đồng đều về 2 cực',
        instructionVi: 'Kéo thanh tiến trình sang 70%. Quan sát tâm động tách rời, enzyme separase cắt liên kết cohesin cho phép 2 chromatid chị em phân ly.',
        conceptExplanationVi: 'Các vi ống thể động co ngắn lại kết hợp cùng protein động cơ Dynein/Kinesin kéo 2 bộ NST đơn di chuyển thần tốc về hai cực đối diện của tế bào.',
        targetTab: 'division',
        presetAction: { divisionProgress: 70, speed: 0.5 },
        interactiveTaskVi: 'Quan sát các hình chữ V của nhiễm sắc tử khi bị kéo ngược về hai cực tế bào.',
        checkpointQuestion: {
          questionVi: 'Nếu một nhiễm sắc thể không gắn được vào thoi phân bào mà tế bào vẫn bước vào Kỳ sau, hậu quả là gì?',
          optionsVi: [
            'Không có vấn đề gì xảy ra',
            'Dẫn đến đột biến lệch bội (Aneuploidy) - một tế bào con thừa NST còn tế bào kia thiếu NST, nguyên nhân hàng đầu gây ung thư hoặc dị tật thai nhi',
            'Tế bào sẽ biến thành vi khuẩn',
            'Tế bào sẽ lập tức quang hợp',
          ],
          correctIndex: 1,
          explanationVi: 'Sự không phân ly của NST tạo ra tế bào lệch bội (như 3 nhiễm sắc thể 21 gây hội chứng Down) hoặc kích hoạt đột biến bất ổn định bộ gen dẫn tới ung thư.',
        },
        takeawayVi: 'Nguyên phân là quá trình sao chép di truyền chuẩn xác tuyệt đối, quyết định tính kế thừa sự sống.',
      },
      {
        stepNumber: 3,
        titleVi: 'Bước 3: Kỳ cuối & Phân chia tế bào chất (Cytokinesis)',
        instructionVi: 'Quan sát màng nhân tái lập bao bọc 2 bộ NST đơn dãn xoắn. Vòng co thắt actin-myosin thắt đôi tế bào con.',
        conceptExplanationVi: 'Ở tế bào động vật, vòng vi sợi actin và myosin thắt sâu tạo rãnh phân cắt từ ngoài vào trong chia đôi bào tương. Ở thực vật, do có thành cellulose cứng nên các túi Golgi tập trung ở mặt phẳng xích đạo hợp nhất tạo phiến tế bào (cell plate) lớn dần từ trong ra ngoài.',
        targetTab: 'division',
        presetAction: { divisionProgress: 95, speed: 0.5 },
        interactiveTaskVi: 'Kéo tiến trình đến 95% và xem sự hình thành 2 nhân con cùng sự tách rời của 2 tế bào mới.',
        checkpointQuestion: {
          questionVi: 'Điểm khác biệt căn bản trong phân chia tế bào chất giữa tế bào động vật và tế bào thực vật là gì?',
          optionsVi: [
            'Tế bào thực vật dùng ti thể để cắt đôi, tế bào động vật dùng lục lạp',
            'Tế bào động vật thắt eo rãnh phân cắt từ ngoài vào, còn thực vật hình thành vách ngăn (cell plate) từ trong ra ngoài do thành cellulose cứng không thể uốn cong',
            'Tế bào thực vật không có phân chia tế bào chất',
            'Tế bào động vật luôn phân chia thành 4 tế bào con',
          ],
          correctIndex: 1,
          explanationVi: 'Thành cellulose cứng ngăn không cho màng tế bào thực vật lõm vào, buộc tế bào phải dùng túi màng Golgi vận chuyển pectin và cellulose xây vách ngăn từ tâm ra mép ngoài.',
        },
        takeawayVi: 'Từ 1 tế bào mẹ ban đầu, nguyên phân tạo ra 2 tế bào con có bộ máy di truyền 2n giống hệt nhau và giống tế bào mẹ.',
      },
    ],
  },
];
