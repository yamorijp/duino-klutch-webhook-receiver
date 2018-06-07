# duino-klutch-webhook-receiver

[Prometheus Alertmanager](https://prometheus.io/docs/alerting/alertmanager/)
から使用する[duino-kluch](https://github.com/yamorijp/duino-klutch)用のwebhookレシーバーです。
アラートメッセージをduino-kluchへ転送し、8x8 Matrix LEDディスプレイで表示します。

## セットアップ

※動作には、メッセージ転送先となるMatrixディスプレイを接続した[duino-klutch]((https://github.com/yamorijp/duino-klutch))デバイスが必要です。

当プログラムはnodejsを使用したwebサーバーです。
パッケージマネージャを使用して依存パッケージをインストールします。

```
$ yarn
```

ポート3001番でサーバーを起動します。

```
$ yarn start
```

Prometheusでアラートルールを作成します。
`annotations`へ`summary`を追加してください。
ここで指定した文字列をアラートメッセージとして使用します。

```
groups:
- name: main
  rules:
  - alert: InstanceDown
    expr: up == 0
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: "Instance {{ $labels.instance }} down"
      description: "{{ $labels.instance }} of job {{ $labels.job }} has bennd down for more than 5 minutes"
```

Alertmanagerへレシーバーを追加します。

```
receivers:
  name: "duino-k"
  webhook_configs:
  - url: "http://127.0.0.1:3001/alerts"
    send_resolved: true
```
