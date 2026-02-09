// Base UI Component: SectionHeader

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    icon?: React.ReactNode;
}

export function SectionHeader({ title, subtitle, icon }: SectionHeaderProps) {
    return (
        <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
                {icon && <div className="text-blue-600">{icon}</div>}
                <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            </div>
            {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>
    );
}
