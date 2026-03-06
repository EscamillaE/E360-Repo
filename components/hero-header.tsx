'use client'
import Link from 'next/link'
import { Menu, X, Palette } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React from 'react'
import { useScroll, motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageToggle } from '@/components/language-toggle'
import { E360Logo } from '@/components/e360-logo'
import { useI18n } from '@/lib/i18n'

const colorPresets = {
    gold: ["#A07C2A", "#C4922A", "#D4A843", "#E8C060"],
    crimson: ["#7C444F", "#9F5255", "#E16A54", "#F39E60"],
    emerald: ["#F0E491", "#BBC863", "#658C58", "#31694E"],
    rose: ["#FCF5EE", "#FFC4C4", "#EE6983", "#850E35"],
    violet: ["#4E56C0", "#9B5DE0", "#D78FEE", "#FDCFFA"],
    ocean: ["#3C467B", "#50589C", "#636CCB", "#6E8CFB"],
}

type HeroHeaderProps = {
    onColorPresetChange?: (colors: string[]) => void
}

export const HeroHeader = ({ onColorPresetChange }: HeroHeaderProps) => {
    const [menuOpen, setMenuOpen] = React.useState(false)
    const [scrolled, setScrolled] = React.useState(false)
    const { scrollYProgress } = useScroll()
    const { t } = useI18n()

    React.useEffect(() => {
        const unsubscribe = scrollYProgress.on('change', (latest) => {
            setScrolled(latest > 0.05)
        })
        return () => unsubscribe()
    }, [scrollYProgress])

    const handleColorPresetChange = (preset: keyof typeof colorPresets) => {
        if (onColorPresetChange) {
            onColorPresetChange(colorPresets[preset])
        }
    }

    const handleNavClick = (href: string) => {
        setMenuOpen(false)
        if (href.startsWith('#')) {
            const el = document.querySelector(href)
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
        }
    }

    const menuItems = [
        { name: t("nav.services"), href: '#services' },
        { name: t("nav.packages" as never), href: '/packages', isLink: true },
        { name: t("nav.portfolio"), href: '#portfolio' },
        { name: t("nav.about"), href: '#about' },
        { name: t("nav.contact"), href: '#contact' },
    ]

    return (
        <header>
            <nav className="fixed z-50 w-full px-4 pt-2">
                <div className={cn(
                    'mx-auto max-w-7xl rounded-2xl px-5 transition-all duration-500 lg:px-8',
                    scrolled
                        ? 'bg-background/80 backdrop-blur-xl border border-border/30 shadow-lg shadow-background/20'
                        : 'bg-transparent'
                )}>
                    <div className={cn(
                        'relative flex items-center justify-between transition-all duration-300',
                        scrolled ? 'py-2.5' : 'py-4'
                    )}>
                        {/* Logo */}
                        <E360Logo size={scrolled ? "small" : "default"} />

                        {/* Desktop nav */}
                        <div className="hidden items-center gap-1 lg:flex">
                            {menuItems.map((item) => (
                                'isLink' in item && item.isLink ? (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                                    >
                                        {item.name}
                                    </Link>
                                ) : (
                                    <button
                                        key={item.href}
                                        onClick={() => handleNavClick(item.href)}
                                        className="rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                                    >
                                        {item.name}
                                    </button>
                                )
                            ))}
                        </div>

                        {/* Right actions */}
                        <div className="flex items-center gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="hidden h-9 w-9 rounded-full bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/30 lg:flex">
                                        <Palette className="h-4 w-4" />
                                        <span className="sr-only">Change color preset</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-popover/95 backdrop-blur-xl border-border">
                                    {Object.entries(colorPresets).map(([key, value]) => (
                                        <DropdownMenuItem
                                            key={`preset-${key}`}
                                            onClick={() => handleColorPresetChange(key as keyof typeof colorPresets)}
                                            className="cursor-pointer capitalize gap-3">
                                            <div className="flex gap-1">
                                                {value.map((color, i) => (
                                                    <div
                                                        key={i}
                                                        className="size-3 rounded-full border border-border/30"
                                                        style={{ backgroundColor: color }}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-sm">{key}</span>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <LanguageToggle />
                            <ThemeToggle />

                            <Button
                                asChild
                                size="sm"
                                className="hidden h-9 rounded-full px-5 text-xs font-semibold bg-[var(--gold)] text-background hover:bg-[var(--gold-neon)] transition-colors shadow-sm shadow-[var(--gold)]/10 lg:flex"
                            >
                                <Link href="/configure">
                                    {t("nav.configure")}
                                </Link>
                            </Button>

                            {/* Mobile hamburger */}
                            <button
                                onClick={() => setMenuOpen(!menuOpen)}
                                aria-label={menuOpen ? 'Close Menu' : 'Open Menu'}
                                className="relative z-50 flex h-9 w-9 items-center justify-center rounded-full border border-border/30 bg-muted/50 lg:hidden">
                                <Menu className={cn("h-4 w-4 text-foreground transition-all duration-200", menuOpen && "rotate-90 scale-0 opacity-0")} />
                                <X className={cn("absolute h-4 w-4 text-foreground transition-all duration-200", menuOpen ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0")} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                <AnimatePresence>
                    {menuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                            className="mx-auto mt-2 max-w-7xl overflow-hidden rounded-2xl border border-border/40 bg-background/95 p-6 shadow-2xl backdrop-blur-xl lg:hidden"
                        >
                            <ul className="space-y-1">
                                {menuItems.map((item) => (
                                    <li key={item.href}>
                                        {'isLink' in item && item.isLink ? (
                                            <Link
                                                href={item.href}
                                                onClick={() => setMenuOpen(false)}
                                                className="block w-full rounded-xl px-4 py-3 text-left text-base font-medium text-foreground transition-colors hover:bg-muted/50"
                                            >
                                                {item.name}
                                            </Link>
                                        ) : (
                                            <button
                                                onClick={() => handleNavClick(item.href)}
                                                className="w-full rounded-xl px-4 py-3 text-left text-base font-medium text-foreground transition-colors hover:bg-muted/50"
                                            >
                                                {item.name}
                                            </button>
                                        )}
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-4 border-t border-border/30 pt-4">
                                <Button
                                    asChild
                                    className="w-full h-12 rounded-xl text-base font-semibold bg-[var(--gold)] text-background hover:bg-[var(--gold-neon)] transition-colors"
                                >
                                    <Link href="/configure" onClick={() => setMenuOpen(false)}>
                                        {t("nav.configure")}
                                    </Link>
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </header>
    )
}
