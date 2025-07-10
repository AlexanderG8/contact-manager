
const Copyright = () => {
  const currentYear = new Date().getFullYear();

  return (
    <p>
      Copyright © <a href="https://alexanderg8.github.io/my-portfolio-web/" target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:text-purple-500 transition-colors">Alexander Gomez</a> {currentYear}
    </p>
  );
};

export default Copyright;
