export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="animate-fade-up mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand text-white shadow-sm">
        <Icon className="h-8 w-8" />
      </div>
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
