export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-muted-foreground mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          
          <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing and using Vibe Voicer, you accept and agree to be bound by the terms 
            and provision of this agreement.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4">Use License</h2>
          <p className="mb-4">
            Permission is granted to temporarily use Vibe Voicer for personal, non-commercial 
            transitory viewing only. This is the grant of a license, not a transfer of title.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4">Service Availability</h2>
          <p className="mb-4">
            We strive to maintain high service availability, but we do not guarantee that our 
            service will be uninterrupted or error-free.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4">User Responsibilities</h2>
          <p className="mb-4">
            You are responsible for maintaining the confidentiality of your account and password 
            and for all activities that occur under your account.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
          <p className="mb-4">
            If you have any questions about these Terms of Service, please contact us at 
            legal@vibevoicer.com
          </p>
        </div>
      </div>
    </div>
  )
}
