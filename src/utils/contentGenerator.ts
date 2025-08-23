interface ProductData {
  product_id: string;
  product_name_raw: string;
  category: string;
  specifications: string;
  image_analysis: string;
  target_audience: string;
  primary_keyword: string;
  secondary_keywords: string;
  tone_of_voice: string;
  negative_keywords: string;
}

interface GeneratedContent {
  generated_title: string;
  generated_description: string;
  generated_features_list: string[];
}

export class ContentGenerator {
  static async generateContent(data: ProductData): Promise<GeneratedContent> {
    // Simulate API processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const title = this.generateTitle(data);
    const description = this.generateDescription(data);
    const features = this.generateFeaturesList(data);

    return {
      generated_title: title,
      generated_description: description,
      generated_features_list: features
    };
  }

  private static generateTitle(data: ProductData): string {
    const { primary_keyword, product_name_raw, specifications } = data;
    
    // Extract key benefits from specifications
    const keyFeatures = this.extractKeyFeatures(specifications);
    const uniqueSellingPoint = keyFeatures[0] || "Premium Quality";
    
    // Format: [Primary Keyword] - [Key Benefit] with [USP] - [Product Name/Type]
    const title = `${primary_keyword} - ${uniqueSellingPoint} with Advanced Features - ${product_name_raw}`;
    
    // Ensure title is within 50-70 characters
    if (title.length > 70) {
      return `${primary_keyword} - ${uniqueSellingPoint} - ${product_name_raw}`;
    }
    if (title.length < 50) {
      return `${primary_keyword} - Premium ${uniqueSellingPoint} Technology - ${product_name_raw}`;
    }
    
    return title;
  }

  private static generateDescription(data: ProductData): string {
    const { target_audience, product_name_raw, specifications, image_analysis, secondary_keywords, tone_of_voice } = data;
    
    // Hook based on target audience
    const hooks = {
      "Busy remote workers": "Tired of your coffee or tea turning cold in the middle of a crucial task?",
      "Tech-savvy professionals": "Struggling to find technology that truly enhances your daily workflow?",
      "Fitness enthusiasts": "Looking for gear that keeps up with your active lifestyle?",
      "Home chefs": "Ready to elevate your culinary creations to restaurant quality?",
      "Students": "Need tools that support your academic success without breaking the bank?"
    };
    
    const hook = hooks[target_audience as keyof typeof hooks] || `Searching for the perfect solution for ${target_audience.toLowerCase()}?`;
    
    // Problem and solution
    const problem = "The constant interruptions break your focus and ruin the perfect experience you deserve.";
    const solution = `The ${product_name_raw} is engineered for ${target_audience.toLowerCase()} who demand perfection.`;
    
    // Benefits from specifications
    const benefits = this.extractBenefits(specifications, image_analysis);
    
    // Weave in secondary keywords naturally
    const keywordIntegration = secondary_keywords ? 
      `This innovative ${secondary_keywords.split(',')[0]?.trim()} becomes a seamless part of your modern lifestyle.` :
      `This innovative solution becomes a seamless part of your modern lifestyle.`;
    
    // Closing statement
    const closing = `Experience the luxury of perfection, from the first moment to the last. Elevate your standards and never settle for ordinary again.`;
    
    const description = `${hook} ${problem} ${solution}

${benefits} ${keywordIntegration} Through intuitive design and premium materials, every detail has been crafted for your satisfaction.

${closing}`;
    
    return description;
  }

  private static generateFeaturesList(data: ProductData): string[] {
    const { specifications } = data;
    const features: string[] = [];
    
    // Parse specifications and convert to benefit-focused features
    const specs = specifications.toLowerCase();
    
    if (specs.includes('battery') || specs.includes('charge')) {
      const batteryInfo = this.extractBatteryInfo(specs);
      features.push(`EXTENDED BATTERY: ${batteryInfo}`);
    }
    
    if (specs.includes('material') || specs.includes('steel') || specs.includes('aluminum')) {
      const materialInfo = this.extractMaterialInfo(specs);
      features.push(`PREMIUM BUILD: ${materialInfo}`);
    }
    
    if (specs.includes('app') || specs.includes('bluetooth') || specs.includes('smart')) {
      features.push(`APP INTEGRATION: Effortlessly control via advanced connectivity for seamless tech experience.`);
    }
    
    if (specs.includes('temperature') || specs.includes('heating') || specs.includes('cooling')) {
      const tempInfo = this.extractTemperatureInfo(specs);
      features.push(`PRECISION CONTROL: ${tempInfo}`);
    }
    
    if (specs.includes('capacity') || specs.includes('size') || specs.includes('ml') || specs.includes('oz')) {
      const capacityInfo = this.extractCapacityInfo(specs);
      features.push(`OPTIMAL SIZE: ${capacityInfo}`);
    }
    
    // Ensure we have 3-5 features
    while (features.length < 3) {
      features.push(`QUALITY ASSURED: Professional-grade construction meets exceptional performance standards.`);
    }
    
    return features.slice(0, 5);
  }

  private static extractKeyFeatures(specifications: string): string[] {
    const features = [];
    const specs = specifications.toLowerCase();
    
    if (specs.includes('smart') || specs.includes('app')) features.push('Smart Control');
    if (specs.includes('premium') || specs.includes('steel')) features.push('Premium Materials');
    if (specs.includes('battery') || specs.includes('wireless')) features.push('Wireless Technology');
    if (specs.includes('temperature') || specs.includes('heating')) features.push('Temperature Control');
    if (specs.includes('fast') || specs.includes('quick')) features.push('Fast Performance');
    
    return features.length > 0 ? features : ['Advanced Technology'];
  }

  private static extractBenefits(specifications: string, imageAnalysis: string): string {
    const specs = specifications.toLowerCase();
    const image = imageAnalysis.toLowerCase();
    
    let benefits = "Crafted with attention to every detail, this product delivers exceptional performance that exceeds expectations.";
    
    if (specs.includes('steel') && image.includes('black')) {
      benefits = "Crafted from premium materials with a sleek, professional finish that complements any modern environment.";
    }
    
    if (specs.includes('bluetooth') || specs.includes('app')) {
      benefits = "Advanced connectivity seamlessly integrates with your digital lifestyle, putting complete control at your fingertips.";
    }
    
    return benefits;
  }

  private static extractBatteryInfo(specs: string): string {
    if (specs.includes('4 hours')) return 'Enjoy up to 4 hours of uninterrupted performance on a single charge.';
    if (specs.includes('battery')) return 'Long-lasting power keeps you going throughout your busy day.';
    return 'Reliable battery performance when you need it most.';
  }

  private static extractMaterialInfo(specs: string): string {
    if (specs.includes('304 stainless steel')) return 'Constructed from food-grade 304 stainless steel with premium finish.';
    if (specs.includes('steel')) return 'Built with premium stainless steel for lasting durability and style.';
    if (specs.includes('aluminum')) return 'Lightweight yet durable aluminum construction for everyday excellence.';
    return 'Premium materials ensure lasting quality and professional appearance.';
  }

  private static extractTemperatureInfo(specs: string): string {
    if (specs.includes('55-65')) return 'Maintain your ideal temperature between 55-65°C with precision control.';
    if (specs.includes('temperature')) return 'Advanced temperature management keeps everything at the perfect level.';
    return 'Precise temperature control for optimal results every time.';
  }

  private static extractCapacityInfo(specs: string): string {
    if (specs.includes('400ml')) return 'Perfect 400ml capacity designed for your daily needs and portability.';
    if (specs.includes('ml') || specs.includes('oz')) return 'Thoughtfully sized for optimal convenience and functionality.';
    return 'Perfectly proportioned for everyday use and maximum convenience.';
  }
}