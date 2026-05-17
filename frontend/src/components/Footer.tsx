export function Footer() {
  return (
    <footer
      style={{
        background: 'var(--header-footer-bg)',
        color: '#ffffff',
        padding: '18px 28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        fontFamily: 'var(--font-sans)',
        fontSize: '0.875rem',
        fontWeight: 400,
        marginTop: 'auto'
      }}
    >
      <span>© Processo de Trainee Unect Jr.</span>
      <span>Feito com ❤️ por João Levi Cabral Piotto</span>
    </footer>
  );
}
