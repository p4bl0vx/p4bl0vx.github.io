---
title: "SubdomainHunter"
description: "Herramienta automatizada para descubrimiento y enumeración de subdominios con múltiples técnicas y fuentes de datos."
publishDate: 2024-01-15
tags: ["reconnaissance", "subdomain-enumeration", "python", "automation"]
category: "tool"
github: "https://github.com/chess/SubdomainHunter"
demo: "https://asciinema.org/a/example"
image: "/images/projects/subdomain-hunter.png"
featured: true
status: "active"
---

**SubdomainHunter** es una herramienta de reconocimiento automatizada que combina múltiples técnicas para el descubrimiento exhaustivo de subdominios. Desarrollada en Python3, utiliza tanto métodos pasivos como activos para maximizar la cobertura durante la fase de reconnaissance.

## 🚀 Características principales

### Múltiples fuentes de datos
- **APIs públicas**: Certificate Transparency, VirusTotal, Shodan, etc.
- **Búsqueda DNS**: Fuerza bruta con listas de palabras personalizadas
- **Web scraping**: Análisis de código fuente y headers HTTP
- **Archivo zones**: Transferencias de zona cuando es posible

### Técnicas avanzadas
- **Permutación de subdominios**: Generación inteligente de variantes
- **Wildcard detection**: Identificación y filtrado de registros wildcard
- **Rate limiting**: Respeto de límites de APIs y servidores DNS
- **Threading**: Procesamiento paralelo para mayor velocidad

### Output flexible
- Formatos: JSON, CSV, TXT
- Integración con herramientas populares (Nuclei, httpx, etc.)
- Reporting HTML con visualizaciones

## 🛠️ Instalación

```bash
# Clonar el repositorio
git clone https://github.com/chess/SubdomainHunter.git
cd SubdomainHunter

# Instalar dependencias
pip3 install -r requirements.txt

# Configurar APIs (opcional pero recomendado)
cp config/api_keys.example.yaml config/api_keys.yaml
# Editar con tus API keys
```

## 📋 Uso básico

### Escaneo simple
```bash
python3 subdomain_hunter.py -d example.com
```

### Escaneo avanzado con múltiples técnicas
```bash
python3 subdomain_hunter.py \
  -d example.com \
  --passive \
  --active \
  --bruteforce \
  --permutations \
  --threads 50 \
  --output json \
  --file results/example_com.json
```

### Configuración avanzada
```bash
python3 subdomain_hunter.py \
  -d example.com \
  --wordlist wordlists/custom.txt \
  --resolver-timeout 5 \
  --max-depth 3 \
  --exclude-wildcards \
  --verify-ssl \
  --screenshot
```

## 🔧 Arquitectura técnica

### Módulos principales

```python
src/
├── core/
│   ├── domain_validator.py    # Validación de dominios
│   ├── dns_resolver.py        # Resolución DNS personalizada  
│   └── rate_limiter.py        # Control de velocidad
├── passive/
│   ├── certificate_search.py # Certificate Transparency
│   ├── search_engines.py     # Google, Bing, etc.
│   └── api_sources.py        # VirusTotal, Shodan, etc.
├── active/
│   ├── dns_bruteforce.py     # Fuerza bruta DNS
│   ├── permutation_engine.py # Generador de permutaciones
│   └── zone_transfer.py      # Transferencias de zona
└── output/
    ├── formatters.py         # Formateadores de salida
    └── reporters.py          # Generadores de reportes
```

### Algoritmo de permutación

```python
def generate_permutations(subdomain, wordlist):
    """
    Genera permutaciones inteligentes de subdominios
    basadas en patrones comunes y contexto
    """
    patterns = [
        "{sub}-{word}",      # dev-api
        "{word}-{sub}",      # api-dev  
        "{sub}{word}",       # devapi
        "{word}{sub}",       # apidev
        "{sub}.{word}",      # dev.api
        "{word}.{sub}",      # api.dev
    ]
    
    permutations = []
    for word in wordlist:
        for pattern in patterns:
            perm = pattern.format(sub=subdomain, word=word)
            if is_valid_subdomain(perm):
                permutations.append(perm)
    
    return list(set(permutations))
```

## 📊 Rendimiento

### Benchmarks en dominios reales

| Dominio | Subdominios encontrados | Tiempo (s) | Técnica más efectiva |
|---------|-------------------------|------------|----------------------|
| google.com | 2,847 | 156 | Certificate Transparency |
| facebook.com | 1,923 | 143 | Permutaciones + Bruteforce |
| amazon.com | 4,102 | 287 | APIs + Web Scraping |
| microsoft.com | 3,156 | 198 | Múltiples fuentes |

### Optimizaciones implementadas

1. **Caché inteligente**: Evita consultas DNS duplicadas
2. **Resolvers múltiples**: Balanceo de carga entre resolvers
3. **Filtering avanzado**: Elimina falsos positivos automáticamente
4. **Batch processing**: Agrupa consultas para mejor eficiencia

## 🔍 Casos de uso

### Bug Bounty
```bash
# Reconocimiento exhaustivo para programa de bug bounty
python3 subdomain_hunter.py \
  -d target.com \
  --all-techniques \
  --deep-scan \
  --live-hosts \
  --screenshots \
  --nuclei-scan
```

### Auditoría de seguridad
```bash
# Mapeo de superficie de ataque para auditoría
python3 subdomain_hunter.py \
  -d client.com \
  --passive-only \
  --stealth-mode \
  --output-format json \
  --include-metadata
```

### Monitoreo continuo
```bash
# Cron job para monitoreo de nuevos subdominios
0 2 * * * /usr/bin/python3 /path/to/subdomain_hunter.py \
  -d example.com \
  --diff-mode \
  --notify-webhook https://hooks.slack.com/...
```

## 🛡️ Consideraciones de seguridad

### Rate limiting inteligente
- Respeta robots.txt y headers de rate limiting
- Implementa backoff exponencial en caso de 429/503
- Distribuye consultas entre múltiples resolvers

### OPSEC (Operational Security)
- Modo stealth para evitar detección
- Rotación automática de User-Agents
- Proxy chain support para anonimato

## 🚧 Roadmap

### v2.0 (En desarrollo)
- [ ] Interfaz web interactiva
- [ ] Machine Learning para predicción de subdominios
- [ ] Integración con Kubernetes para escalabilidad
- [ ] API REST para automatización

### v2.1 (Planificado)
- [ ] Soporte para IPv6
- [ ] Análisis de certificados SSL/TLS avanzado
- [ ] Detección automática de CDNs y clouds
- [ ] Dashboard en tiempo real

## 🤝 Contribuciones

Las contribuciones son bienvenidas! Por favor:

1. Fork el repositorio
2. Crea una branch para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Áreas que necesitan ayuda
- Optimización de algoritmos de permutación
- Nuevas fuentes de datos pasivas
- Mejoras en la detección de wildcards
- Documentación y testing

---

**Stack**: Python3, asyncio, aiohttp, dnspython  
**Licencia**: MIT  
**Mantenedor**: [@chess](https://github.com/chess)
