export default function ServicesSection() {
  return (
    <section className="relative px-4 sm:px-8 md:px-16 lg:px-20 py-16 sm:py-20 lg:py-24 flex flex-col items-center">
      {/* Ambient Glow */}
      <div className="absolute top-1/2 right-[-10%] -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-white opacity-[0.03] blur-[100px] sm:blur-[150px] rounded-full pointer-events-none -z-10"></div>
      <div className="max-w-6xl w-full text-center space-y-8 relative z-10">
        <span className="material-symbols-outlined text-6xl text-white">design_services</span>
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-white">
          Student Services
        </h2>

        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8 text-left pt-8">
          {/* Card 1 */}
          <div className="group relative bg-[#111] border-4 border-[#262626] hover:border-white transition-colors duration-300 flex flex-col overflow-hidden">
            <div className="h-48 w-full relative overflow-hidden bg-black border-b-4 border-[#262626] group-hover:border-white transition-colors duration-300">
              <img src="/images/coding_service.png" alt="Coding & Debugging" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <div className="p-6 sm:p-8 flex flex-col flex-1">
              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white mb-4">Coding & Debugging</h3>
              <p className="text-white/70 font-medium leading-relaxed flex-1">Stuck on a CS assignment? Hire a peer who already took the class to debug your code or explain the logic.</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group relative bg-[#111] border-4 border-[#262626] hover:border-primary-container transition-colors duration-300 flex flex-col overflow-hidden">
            <div className="h-48 w-full relative overflow-hidden bg-black border-b-4 border-[#262626] group-hover:border-primary-container transition-colors duration-300">
              <img src="/images/research_service.png" alt="Research Papers" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <div className="p-6 sm:p-8 flex flex-col flex-1">
              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-primary-container mb-4">Research Papers</h3>
              <p className="text-white/70 font-medium leading-relaxed flex-1">Need help structuring an essay or finding citations? Find experienced students to review and refine your work.</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group relative bg-[#111] border-4 border-[#262626] hover:border-tertiary transition-colors duration-300 flex flex-col overflow-hidden">
            <div className="h-48 w-full relative overflow-hidden bg-black border-b-4 border-[#262626] group-hover:border-tertiary transition-colors duration-300">
              <img src="/images/abstract_services.png" alt="Many More" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <div className="p-6 sm:p-8 flex flex-col flex-1">
              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-tertiary mb-4">Many More</h3>
              <p className="text-white/70 font-medium leading-relaxed flex-1">From graphic design to tutoring, photography to moving help—discover what your campus has to offer.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
