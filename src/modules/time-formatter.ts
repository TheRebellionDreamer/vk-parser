const { format } = new Intl.DateTimeFormat("ru", {
	hour: "2-digit",
	minute: "2-digit",
	second: "2-digit",
});

export function timeFormatter(date: Date) {
	return format(date);
}
