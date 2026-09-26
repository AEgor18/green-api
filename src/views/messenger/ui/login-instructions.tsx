export function LoginInstructions() {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-light md:text-3xl">Вход в инстанс</h1>
      <ol className="flex list-decimal flex-col gap-3 pl-5 text-[15px] leading-relaxed text-muted-foreground">
        <li>
          Зарегистрируйтесь на{' '}
          <a
            href="https://console.green-api.com"
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline"
          >
            console.green-api.com
          </a>{' '}
          и создайте инстанс.
        </li>
        <li>Привяжите телефон: отсканируйте QR-код в приложении мессенджера.</li>
        <li>
          Скопируйте <b>idInstance</b>, <b>apiTokenInstance</b> и <b>apiUrl</b> из карточки
          инстанса.
        </li>
      </ol>
    </div>
  );
}
