import Copyright from './Copyright';

const Footer = () => {
  return (
    <footer className="py-6 mt-8 border-t border-slate-800">
      <div className="container mx-auto px-4 flex justify-center items-center">
        <div className="text-slate-500 text-sm">
          <Copyright />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
