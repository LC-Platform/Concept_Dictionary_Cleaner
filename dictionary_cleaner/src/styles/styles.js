export const colors = {
  primary: '#4a6fa5',
  secondary: '#6b8cae',
  accent: '#ff7e5f',
  background: '#f8f9fa',
  text: '#333',
  lightText: '#6c757d',
  border: '#dee2e6',
  success: '#28a745',
  warning: '#ffc107',
  danger: '#dc3545',
  info: '#17a2b8',
};

export const typography = {
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  fontSize: {
    small: '0.875rem',
    medium: '1rem',
    large: '1.25rem',
    xlarge: '1.5rem',
    xxlarge: '2rem',
  },
};

export const spacing = {
  small: '8px',
  medium: '16px',
  large: '24px',
  xlarge: '32px',
};

export const shadows = {
  small: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
  medium: '0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)',
  large: '0 10px 20px rgba(0,0,0,0.1), 0 6px 6px rgba(0,0,0,0.1)',
};

export const buttonStyles = {
  primary: {
    backgroundColor: colors.primary,
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: `${spacing.small} ${spacing.medium}`,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#3a5a80',
    },
    '&:disabled': {
      backgroundColor: colors.lightText,
      cursor: 'not-allowed',
    },
  },
  secondary: {
    backgroundColor: colors.secondary,
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: `${spacing.small} ${spacing.medium}`,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#5a7c9e',
    },
  },
  danger: {
    backgroundColor: colors.danger,
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: `${spacing.small} ${spacing.medium}`,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#c82333',
    },
  },
};

export const inputStyles = {
  base: {
    padding: spacing.small,
    border: `1px solid ${colors.border}`,
    borderRadius: '4px',
    fontSize: typography.fontSize.medium,
    '&:focus': {
      outline: 'none',
      borderColor: colors.primary,
      boxShadow: `0 0 0 2px ${colors.primary}20`,
    },
  },
};

export const tableStyles = {
  base: {
    width: '100%',
    borderCollapse: 'collapse',
    margin: `${spacing.medium} 0`,
    boxShadow: shadows.small,
  },
  header: {
    backgroundColor: colors.primary,
    color: 'white',
    textAlign: 'left',
  },
  cell: {
    padding: spacing.medium,
    border: `1px solid ${colors.border}`,
    wordBreak: 'break-word',
  },
  row: {
    '&:nth-child(even)': {
      backgroundColor: '#f2f2f2',
    },
    '&:hover': {
      backgroundColor: '#e9ecef',
    },
  },
};

export const cardStyles = {
  base: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: spacing.large,
    marginBottom: spacing.large,
    boxShadow: shadows.medium,
  },
  title: {
    color: colors.primary,
    marginTop: '0',
    marginBottom: spacing.medium,
  },
};