const snakeToCamel = (s: string): string => s.replace(/(_\w)/g, match => match[1].toUpperCase())

export default snakeToCamel
