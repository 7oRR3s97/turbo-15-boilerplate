const App = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-blue-500">
      <h1 className="font-extrabold">Shell Unificado</h1>
      <p>Podemos aqui começar a construir coisas offline</p>
      <a
        href="http://localhost:3000"
        target="_self"
        className="bg-colors-text-main-5"
      >
        Ou abrir localhost:3000
      </a>
    </div>
  );
};

export default App;
